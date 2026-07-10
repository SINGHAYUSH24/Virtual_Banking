package com.example.SpringDemo.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.SpringDemo.Entity.AccountEntity;
import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.Exception.InvalidCredentialException;
import com.example.SpringDemo.Exception.NoDataException;
import com.example.SpringDemo.Mapper.AccountMapper;
import com.example.SpringDemo.Mapper.UserMapper;
import com.example.SpringDemo.Repository.UserRepository;
import com.example.SpringDemo.Repository.PayeeRepository;
import com.example.SpringDemo.Repository.AccountRepository;
import com.example.SpringDemo.Entity.PayeeEntity;
import com.example.SpringDemo.Entity.AccountEntity;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.CreateUserRequest;
import com.example.SpringDemo.dto.DashboardResponse;
import com.example.SpringDemo.dto.Transaction;
import com.example.SpringDemo.dto.UserData;
import com.example.SpringDemo.dto.PayeeRequest;

import jakarta.transaction.Transactional;
@Service
public class UserService {
    private final UserMapper mapper;
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final AccountMapper acc;
    private final AccountService service;
    private final PayeeRepository payeeRepo;
    private final AccountRepository accountRepo;
    public UserService(UserMapper mapper,UserRepository repo,PasswordEncoder passwordEncoder,AccountMapper acc,AccountService service,PayeeRepository payeeRepo,AccountRepository accountRepo){
        this.mapper=mapper;
        this.repo=repo;
        this.passwordEncoder=passwordEncoder;
        this.acc=acc;
        this.service=service;
        this.payeeRepo=payeeRepo;
        this.accountRepo=accountRepo;
    }
    public UserData createUser(CreateUserRequest request){
        if(repo.existsByNumber(request.getNumber())){
           throw new InvalidCredentialException("Mobile Number already registered");
        }
        UserEntity entity= mapper.toEntity(request);
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        UserEntity saved=repo.save(entity);
        return mapper.todto(saved);
    }
    public UserEntity getUser(){
        Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        Long number=(Long)auth.getPrincipal();
        UserEntity user=repo.findByNumber(number).orElseThrow(()->new InvalidCredentialException("User not Found!"));
        return user;
    }
    public UserData getUserData(){
        UserEntity user=getUser();
        UserData data=new UserData();
        data.setId(user.getId());
        data.setName(user.getName());
        data.setNumber(user.getNumber());
        List<AccountResponse> arr=user.getAccounts().stream().map(account->acc.todto(account)).collect(Collectors.toList());
        data.setAccounts(arr);
        return data;
    }
    public List<UserData> findAll(){
        List<UserEntity> users=repo.findAll();
        if(users.isEmpty()){
            throw new NoDataException("No Data Found");
        }
        return users.stream().map(mapper::todto).toList();
    }
    @Transactional
    public UserData updatedata(UserData data){
        UserEntity entity=getUser();
        entity.setName(data.getName());
        entity.setNumber(data.getNumber());
        return mapper.todto(entity);
    }
    @Transactional
    public String deleteUser(int id){
        UserEntity user=getUser();
        repo.delete(user);
        return "User Deleted";
    }
    public List<Transaction> getTransactions(){
        UserEntity user=getUser();
        List<AccountEntity> accounts=user.getAccounts();
        List<Transaction> transactions=new ArrayList<>();
        for(int i=0;i<accounts.size();i++){
            AccountEntity account=accounts.get(i);
            List<Transaction> transaction=service.getAllTransactions(account.getId());
            transactions.addAll(transaction);
        }
        return transactions;
    }
    public DashboardResponse getDashboard() {
    UserEntity user=getUser();
    List<AccountEntity> accounts=user.getAccounts();
    List<Long> userIds=accounts.stream().map(account->account.getId()).collect(Collectors.toList());
    List<Transaction> transactions = getTransactions();
    LocalDateTime last30Days = LocalDateTime.now().minusDays(30);
    List<Transaction> recent = transactions.stream().filter(t -> t.getCreatedAt().isAfter(last30Days)).toList();
    double totalExpense = recent.stream().filter(t -> userIds.contains(t.getSenderid())).mapToDouble(Transaction::getAmount).sum();
    double totalIncome = recent.stream().filter(t->userIds.contains(t.getReceiverid())).mapToDouble(Transaction::getAmount).sum();
    double netIncome = totalIncome - totalExpense;
    Map<String, Double> categoryMap = recent.stream()
            .filter(t -> userIds.contains(t.getSenderid()))
            .collect(Collectors.groupingBy(
                    Transaction::getCategory,
                    Collectors.summingDouble(Transaction::getAmount)
            ));

    // Sort + Top 5
    Map<String, Double> topCategories = categoryMap.entrySet().stream()
            .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
            .limit(5)
            .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (a, b) -> a,
                    LinkedHashMap::new
            ));
    Map<String, Double> merchantMap = recent.stream()
            .filter(t -> userIds.contains(t.getReceiverid()))
            .collect(Collectors.groupingBy(
                    Transaction::getMerchantName,
                    Collectors.summingDouble(Transaction::getAmount)
            ));

    Map<String, Double> topMerchants = merchantMap.entrySet().stream()
            .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
            .limit(5)
            .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (a, b) -> a,
                    LinkedHashMap::new
            ));

    DashboardResponse response = new DashboardResponse();
    response.setTotalExpense(totalExpense);
    response.setTotalIncome(totalIncome);
    response.setNetIncome(netIncome);
    response.setTopCategories(topCategories);
    response.setTopMerchants(topMerchants);

    return response;
}
    @Transactional
    public String addPayee(PayeeRequest request) {
        UserEntity currentUser = getUser();
        
        // 1. Fetch destination bank account
        AccountEntity recipientAccount = accountRepo.findById(request.getPayeeAccountId())
            .orElseThrow(() -> new InvalidCredentialException("Payee Bank Account not found!"));

        // Check if user is trying to add their own account as a payee
        List<Long> userAccountIds = currentUser.getAccounts().stream()
            .map(AccountEntity::getId).collect(Collectors.toList());
        if (userAccountIds.contains(request.getPayeeAccountId())) {
            throw new InvalidCredentialException("You cannot register your own account as a payee.");
        }

        // Check if payee is already registered
        if (payeeRepo.findByUserIdAndPayeeAccountId(currentUser.getId(), request.getPayeeAccountId()).isPresent()) {
            throw new InvalidCredentialException("This payee is already registered.");
        }

        // 2. Name-Matching: Validate if user-entered name matches actual recipient name
        String actualRecipientName = recipientAccount.getUser().getName();
        
        String cleanedInput = request.getPayeeName().trim().replaceAll("\\s+", " ");
        String cleanedActual = actualRecipientName.trim().replaceAll("\\s+", " ");
        
        if (!cleanedInput.equalsIgnoreCase(cleanedActual)) {
            throw new InvalidCredentialException("Name mismatch! The bank account is registered under a different name. Please verify the name.");
        }

        // 3. Save the Payee
        PayeeEntity payee = new PayeeEntity();
        payee.setUserId(currentUser.getId());
        payee.setPayeeAccountId(request.getPayeeAccountId());
        payee.setPayeeName(actualRecipientName);
        
        payeeRepo.save(payee);
        return "Payee registered successfully under verified name: " + actualRecipientName;
    }

    public List<PayeeEntity> getPayees() {
        UserEntity currentUser = getUser();
        return payeeRepo.findByUserId(currentUser.getId());
    }
}
