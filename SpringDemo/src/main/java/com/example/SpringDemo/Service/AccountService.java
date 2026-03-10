package com.example.SpringDemo.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.SpringDemo.Entity.AccountEntity;
import com.example.SpringDemo.Entity.TransactionEntity;
import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.Exception.InvalidCredentialException;
import com.example.SpringDemo.Exception.NoDataException;
import com.example.SpringDemo.Mapper.AccountMapper;
import com.example.SpringDemo.Repository.AccountRepository;
import com.example.SpringDemo.Repository.TransactionRepository;
import com.example.SpringDemo.Repository.UserRepository;
import com.example.SpringDemo.dto.AccountBalanceRequest;
import com.example.SpringDemo.dto.AccountBalanceResponse;
import com.example.SpringDemo.dto.AccountRequest;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.AccountsData;
import com.example.SpringDemo.dto.Transaction;
import com.example.SpringDemo.dto.TransactionRequest;

import jakarta.transaction.Transactional;

@Service
public class AccountService {
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final AccountMapper mapper;
    private final AccountRepository accountRepo;
    private final TransactionRepository tRepo;
    public AccountService(UserRepository repo ,AccountRepository repoAccount,PasswordEncoder passwordEncoder,AccountMapper mapper,TransactionRepository tRepo){
        this.repo=repo;
        this.passwordEncoder=passwordEncoder;
        this.mapper=mapper;
        this.accountRepo=repoAccount;
        this.tRepo=tRepo;
    }
    @Transactional
    public String createAccount(AccountRequest request){
        UserEntity user=repo.findByNumber(request.getNumber()).orElseThrow(()->new InvalidCredentialException("User Not Found!"));
        AccountEntity account=new AccountEntity();
        account.setBalance(request.getBalance());
        account.setPin(passwordEncoder.encode(request.getPin()));
        account.setUser(user);
        user.getAccounts().add(account);
        repo.saveAndFlush(user);
        return "Account Created Successfully";
    }
    public List<AccountResponse> getAll(Long number){
        Optional<UserEntity> user=repo.findByNumber(number);
        if(user.isEmpty()){
            throw new InvalidCredentialException("Mobile Number Not Registered");
        }
        UserEntity data=user.get();
        List<AccountEntity> accounts=data.getAccounts();
        List<AccountResponse> result=accounts.stream().map(account->mapper.todto(account)).collect(Collectors.toList());
        return result;
    }
    public List<AccountsData> getAllAccounts(){
        List<AccountEntity> data=accountRepo.findAll();
        if(data.isEmpty()){
            throw new NoDataException("No Accounts Found!");
        }
        List<AccountsData> response=data.stream().map(account->mapper.toResponseAccount(account)).collect(Collectors.toList());
        return response;

    }
    @Transactional
    public String removeAccount(Long id){
        Optional<AccountEntity> entity=accountRepo.findById(id);
        if(entity.isEmpty()){
            throw new InvalidCredentialException("Bank Account Not Found");
        }
        try{
            accountRepo.deleteById(id);
            return "Account deleted Successfully";
        }catch(Exception e){
            throw new NoDataException(e.getMessage());
        }   
    }
    @Transactional
    public Transaction addTransaction(TransactionRequest transaction){
        System.out.println("Request Pin :"+transaction.getPin());
        Optional<AccountEntity> account=accountRepo.findById(transaction.getAccount_id());
        if(account.isEmpty()){
            throw new InvalidCredentialException("Bank Account Not Found");
        }
        Optional<AccountEntity> receiverEntity=accountRepo.findById(transaction.getReceiver_id());
        if(receiverEntity.isEmpty()){
            throw new InvalidCredentialException("Receiver's Bank Account Not Found");
        }
        AccountEntity sender=account.get();
        AccountEntity receiver=receiverEntity.get();
        if(!passwordEncoder.matches(transaction.getPin().trim(),sender.getPin())){
            throw new InvalidCredentialException("UPI Pin is Incorrect");
        }
        sender.setBalance(sender.getBalance()-transaction.getAmount());
        receiver.setBalance(receiver.getBalance()+transaction.getAmount());
        TransactionEntity entity=new TransactionEntity();
        entity.setAmount(transaction.getAmount());
        entity.setSenderid(transaction.getAccount_id());
        entity.setReceiverid(transaction.getReceiver_id());
        entity.setSenderName(sender.getUser().getName());
        entity.setReceiverName(receiver.getUser().getName());
        tRepo.saveAndFlush(entity);
        return mapper.toTransaction(entity);
    }
    public Page<Transaction> getTransactions(Long id,int page,int size){
        Optional<AccountEntity> response=accountRepo.findById(id);
        if(response.isEmpty()){
            throw new InvalidCredentialException("Bank Account Not Found");
        }
        Pageable pageable=PageRequest.of(page,size,Sort.by("createdAt").descending());
        Page<TransactionEntity> transactions=tRepo.findBySenderidOrReceiverid(id,id,pageable);
        Page<Transaction> data=transactions.map(item->mapper.toTransaction(item));
        return data;
    }
    public AccountResponse getAccount(Long id){
        AccountEntity account=accountRepo.findById(id).orElseThrow(()->new InvalidCredentialException("Bank Account not Found"));
        AccountResponse response=mapper.todto(account);
        return response;
    }
    public AccountBalanceResponse getBalance(AccountBalanceRequest request){
        AccountEntity account=accountRepo.findById(request.getId()).orElseThrow(()->new InvalidCredentialException("Bank Account Not Found"));
        AccountBalanceResponse response=new AccountBalanceResponse();
        response.setId(account.getId());
        response.setBalance(account.getBalance());
        return response;
    }
}
