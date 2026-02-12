package com.example.SpringDemo.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.SpringDemo.Entity.AccountEntity;
import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.Exception.InvalidCredentialException;
import com.example.SpringDemo.Mapper.AccountMapper;
import com.example.SpringDemo.Repository.UserRepository;
import com.example.SpringDemo.dto.AccountRequest;
import com.example.SpringDemo.dto.AccountResponse;

import jakarta.transaction.Transactional;

@Service
public class AccountService {
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final AccountMapper mapper;
    public AccountService(UserRepository repo,PasswordEncoder passwordEncoder,AccountMapper mapper){
        this.repo=repo;
        this.passwordEncoder=passwordEncoder;
        this.mapper=mapper;
    }
    @Transactional
    public String createAccount(AccountRequest request){
        if(repo.findByEmail(request.getEmail()).isEmpty()){
            throw new InvalidCredentialException("Email not Registered");
        }
        UserEntity user=repo.findByEmail(request.getEmail()).get();
        AccountEntity account=new AccountEntity();
        account.setBalance(request.getBalance());
        account.setPin(passwordEncoder.encode(request.getPin()));
        account.setUser(user);
        user.getAccounts().add(account);
        repo.saveAndFlush(user);
        return "Account Created Successfully";
    }
    public List<AccountResponse> getAll(String email){
        Optional<UserEntity> user=repo.findByEmail(email);
        if(user.isEmpty()){
            throw new InvalidCredentialException("Email Not Registered");
        }
        UserEntity data=user.get();
        List<AccountEntity> accounts=data.getAccounts();
        List<AccountResponse> result=accounts.stream().map(account->mapper.todto(account)).collect(Collectors.toList());
        return result;
    }

}
