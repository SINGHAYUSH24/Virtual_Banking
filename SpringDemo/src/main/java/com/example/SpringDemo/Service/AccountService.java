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
import com.example.SpringDemo.Entity.MerchantApproval;
import com.example.SpringDemo.Entity.TransactionEntity;
import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.Exception.InvalidCredentialException;
import com.example.SpringDemo.Exception.NoDataException;
import com.example.SpringDemo.Map.BankMap;
import com.example.SpringDemo.Mapper.AccountMapper;
import com.example.SpringDemo.Repository.AccountRepository;
import com.example.SpringDemo.Repository.MerchantApprovalRepository;
import com.example.SpringDemo.Repository.TransactionRepository;
import com.example.SpringDemo.Repository.UserRepository;
import com.example.SpringDemo.Repository.PayeeRepository;
import com.example.SpringDemo.Entity.PayeeEntity;
import com.example.SpringDemo.dto.AccountBalanceRequest;
import com.example.SpringDemo.dto.AccountBalanceResponse;
import com.example.SpringDemo.dto.AccountRequest;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.MerchantRequest;
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
    private final BankMap bankMap;
    private final MerchantApprovalRepository merchantRepo;
    private final PayeeRepository payeeRepo;
    public AccountService(UserRepository repo ,AccountRepository repoAccount,PasswordEncoder passwordEncoder,AccountMapper mapper,TransactionRepository tRepo,BankMap bankMap,MerchantApprovalRepository merchantApprovalRepository,PayeeRepository payeeRepo){
        this.repo=repo;
        this.passwordEncoder=passwordEncoder;
        this.mapper=mapper;
        this.accountRepo=repoAccount;
        this.tRepo=tRepo;
        this.bankMap=bankMap;
        this.merchantRepo=merchantApprovalRepository;
        this.payeeRepo=payeeRepo;
    }
    public String merchantRequest(MerchantRequest request){
        MerchantApproval entity=new MerchantApproval();
        entity.setUserId(request.getId());
        entity.setCategory(request.getType().toString());
        entity.setMerchantName(request.getName());
        merchantRepo.save(entity);
        return "Your Request for Merchant Account has been sent successfully. ";
    }
    @Transactional
    public String createAccount(AccountRequest request){
        UserEntity user=repo.findByNumber(request.getNumber()).orElseThrow(()->new InvalidCredentialException("User Not Found!"));
        AccountEntity account=new AccountEntity();
        account.setBalance(request.getBalance());
        account.setPin(passwordEncoder.encode(request.getPin()));
        System.out.println(request.getBankcode());
        String bankName=bankMap.getBank(request.getBankcode());
        account.setBankname(bankName);
        account.setUser(user);
        user.getAccounts().add(account);
        repo.saveAndFlush(user);
        return " UPI Account Created Successfully";
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
    public List<AccountResponse> getAllAccounts(){
        List<AccountEntity> data=accountRepo.findAll();
        if(data.isEmpty()){
            throw new NoDataException("No Accounts Found!");
        }
        List<AccountResponse> response=data.stream().map(account->mapper.todto(account)).collect(Collectors.toList());
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
        
        // Transaction limit enforcement
        double maxSingleLimit = 25000.0;
        if (transaction.getAmount() > maxSingleLimit) {
            throw new InvalidCredentialException("Transaction amount exceeds the maximum single transaction limit of ₹25,000.");
        }

        double maxDailyLimit = 50000.0;
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        double dailySpent = tRepo.getDailySpent(transaction.getAccount_id(), startOfDay);
        if (dailySpent + transaction.getAmount() > maxDailyLimit) {
            throw new InvalidCredentialException("Transaction would exceed the daily cumulative limit of ₹50,000. Remaining limit today: ₹" + String.format("%.2f", Math.max(0.0, maxDailyLimit - dailySpent)));
        }

        // Payee verification and 10-minute cooling period limit
        boolean isSelfTransfer = receiver.getUser().getId() == sender.getUser().getId();
        boolean isMerchantTransfer = receiver.getType() != com.example.SpringDemo.enums.MerchantEnum.NONE;

        if (!isSelfTransfer && !isMerchantTransfer) {
            Optional<PayeeEntity> payeeOpt = payeeRepo.findByUserIdAndPayeeAccountId(sender.getUser().getId(), transaction.getReceiver_id());
            if (payeeOpt.isEmpty()) {
                throw new InvalidCredentialException("Recipient must be registered as a payee before transferring funds.");
            }
            
            PayeeEntity payee = payeeOpt.get();
            java.time.LocalDateTime cooldownThreshold = payee.getCreatedAt().plusMinutes(10);
            if (java.time.LocalDateTime.now().isBefore(cooldownThreshold)) {
                double maxCooldownLimit = 5000.0;
                if (transaction.getAmount() > maxCooldownLimit) {
                    throw new InvalidCredentialException("Recipient is in a 10-minute cooling period. Maximum transfer limit is ₹5,000 during this time.");
                }
            }
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
    public List<Transaction> getAllTransactions(Long id){
        Optional<AccountEntity> response=accountRepo.findById(id);
        if(response.isEmpty()){
            throw new InvalidCredentialException("Bank Account Not Found");
        }
        List<TransactionEntity> transactions=tRepo.findBySenderidOrReceiverid(id,id);
        List<Transaction> data=transactions.stream().map(item->mapper.toTransaction(item)).collect(Collectors.toList());
        return data;
    }
    public AccountResponse getAccount(Long id){
        AccountEntity account=accountRepo.findById(id).orElseThrow(()->new InvalidCredentialException("Bank Account not Found"));
        AccountResponse response=mapper.todto(account);
        return response;
    }
    public AccountBalanceResponse getBalance(AccountBalanceRequest request){
        AccountEntity account=accountRepo.findById(request.getId()).orElseThrow(()->new InvalidCredentialException("Bank Account Not Found"));
        if (!passwordEncoder.matches(request.getPin().trim(), account.getPin())) {
            throw new InvalidCredentialException("UPI Pin is Incorrect");
        }
        AccountBalanceResponse response=new AccountBalanceResponse();
        response.setId(account.getId());
        response.setBalance(account.getBalance());
        return response;
    }
    public byte[] generateCsvStatement(Long id) {
        List<Transaction> transactions = getAllTransactions(id);
        StringBuilder sb = new StringBuilder();
        sb.append("Transaction ID,Date,Sender ID,Sender Name,Receiver ID,Receiver Name,Amount (INR),Type\n");
        for (Transaction tx : transactions) {
            String type = tx.getSenderid().equals(id) ? "DEBIT" : "CREDIT";
            sb.append(tx.getId()).append(",")
              .append(tx.getCreatedAt() != null ? tx.getCreatedAt().toString() : "").append(",")
              .append(tx.getSenderid()).append(",")
              .append(tx.getSenderName() != null ? tx.getSenderName().replace(",", " ") : "").append(",")
              .append(tx.getReceiverid()).append(",")
              .append(tx.getReceiverName() != null ? tx.getReceiverName().replace(",", " ") : "").append(",")
              .append(tx.getAmount()).append(",")
              .append(type).append("\n");
        }
        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
}
