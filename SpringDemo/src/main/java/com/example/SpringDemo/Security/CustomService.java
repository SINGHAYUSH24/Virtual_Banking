package com.example.SpringDemo.Security;

import java.util.ArrayList;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.Exception.InvalidCredentialException;
import com.example.SpringDemo.Repository.UserRepository;
@Service
public class CustomService implements UserDetailsService{
    private final UserRepository repo;
    public CustomService(UserRepository repo){
        this.repo=repo;
    }
    @Override
    public UserDetails loadUserByUsername(String str){
        Long number=Long.parseLong(str);
        UserEntity user=repo.findByNumber(number).orElseThrow(()-> new InvalidCredentialException("User Not Found"));
        return User.withUsername(str).password(user.getPassword()).authorities(new ArrayList<>()).build();
    }

}
