package com.example.SpringDemo.Service;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.Exception.InvalidCredentialException;
import com.example.SpringDemo.Exception.NoDataException;
import com.example.SpringDemo.Mapper.AccountMapper;
import com.example.SpringDemo.Mapper.UserMapper;
import com.example.SpringDemo.Repository.UserRepository;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.CreateUserRequest;
import com.example.SpringDemo.dto.UserData;

import jakarta.transaction.Transactional;
@Service
public class UserService {
    private final UserMapper mapper;
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final AccountMapper acc;
    public UserService(UserMapper mapper,UserRepository repo,PasswordEncoder passwordEncoder,AccountMapper acc){
        this.mapper=mapper;
        this.repo=repo;
        this.passwordEncoder=passwordEncoder;
        this.acc=acc;
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
}
