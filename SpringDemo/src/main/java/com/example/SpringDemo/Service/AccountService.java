package com.example.SpringDemo.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
import com.example.SpringDemo.dto.AccountRequest;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.AccountsData;
import com.example.SpringDemo.dto.Transaction;
import com.example.SpringDemo.dto.TransactionRequest;
import com.example.SpringDemo.enums.TransactionEnum;

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
        if(repo.findByNumber(request.getNumber()).isEmpty()){
            throw new InvalidCredentialException("Mobile Number not Registered");
        }
        UserEntity user=repo.findByNumber(request.getNumber()).get();
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
            throw new NoDataException("No Accounts Found");
        }
        List<AccountEntity> accounts=data;
        List<AccountsData> response=accounts.stream().map(account->mapper.toData(account)).collect(Collectors.toList());
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
    public int addTransaction(TransactionRequest transaction){
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
        sender.setBalance(sender.getBalance()-transaction.getAmount());
        receiver.setBalance(receiver.getBalance()+transaction.getAmount());
        TransactionEntity entity=new TransactionEntity();
        TransactionEntity entity2=new TransactionEntity();
        entity.setAccount(sender);
        entity.setAmount(transaction.getAmount());
        entity.setType(TransactionEnum.DEBIT);
        entity.setOther_id(transaction.getReceiver_id());
        entity2.setAccount(receiver);
        entity2.setAmount(transaction.getAmount());
        entity2.setType(TransactionEnum.CREDIT);
        entity2.setOther_id(transaction.getAccount_id());
        tRepo.saveAndFlush(entity);
        tRepo.saveAndFlush(entity2);
        return entity.getId();
    }
    public List<Transaction> getTransactions(Long id){
        Optional<AccountEntity> response=accountRepo.findById(id);
        if(response.isEmpty()){
            throw new InvalidCredentialException("Bank Account Not Found");
        }
        AccountEntity account=response.get();
        List<TransactionEntity> transactions=account.getTransactions();
        List<Transaction> data=transactions.stream().map(item->mapper.toTransaction(item)).collect(Collectors.toList());
        return data;
    }
    public AccountResponse getAccount(Long id){
        AccountEntity account=accountRepo.findById(id).orElseThrow(()->new InvalidCredentialException("Bank Account not Found"));
        AccountResponse response=mapper.todto(account);
        return response;
    }
}
