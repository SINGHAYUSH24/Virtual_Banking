package com.example.SpringDemo.Service;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.Exception.NoDataException;
import com.example.SpringDemo.Exception.InvalidCredentialException;
import com.example.SpringDemo.Mapper.UserMapper;
import com.example.SpringDemo.Repository.UserRepository;
import com.example.SpringDemo.dto.Login;
import com.example.SpringDemo.dto.User;
import com.example.SpringDemo.dto.UserRequest;

import jakarta.transaction.Transactional;
@Service
public class UserService {
    private final UserMapper mapper;
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserMapper mapper,UserRepository repo,PasswordEncoder passwordEncoder){
        this.mapper=mapper;
        this.repo=repo;
        this.passwordEncoder=passwordEncoder;
    }
    public User createUser(UserRequest request){
        if(repo.existsByEmail(request.getEmail())){
           throw new InvalidCredentialException("Email already registered");
        }
        UserEntity entity= mapper.toEntity(request);
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        UserEntity saved=repo.save(entity);
        return mapper.todto(saved);
    }
    public void CredentialsMatch(Login cred){
        Optional<UserEntity> data=repo.findByEmail(cred.getEmail());
        if(data.isEmpty()){
            throw new InvalidCredentialException("Email not Registered");
        }
        UserEntity user=data.get();
        boolean match=passwordEncoder.matches(cred.getPassword(),user.getPassword());
        if(!match){
            throw new InvalidCredentialException("Invalid Password");
        }
    }
    public List<User> find(){
        List<UserEntity> users=repo.findAll();
        if(users.isEmpty()){
            throw new NoDataException("No Data Found");
        }
        return users.stream().map(mapper::todto).toList();
    }
    @Transactional
    public User updatedata(User data){
        UserEntity entity=repo.findById(data.getId());
        if(entity==null){
            throw new InvalidCredentialException("User Not Found");
        }
        entity.setName(data.getName());
        entity.setEmail(data.getEmail());
        return mapper.todto(entity);
    }
    @Transactional
    public String deleteUser(int id){
        UserEntity user=repo.findById(id);
        if(user==null){
            throw new InvalidCredentialException("User Not Found");
        }
        repo.delete(user);
        return "User Deleted";
    }
}
