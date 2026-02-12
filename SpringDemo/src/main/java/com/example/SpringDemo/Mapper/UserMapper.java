package com.example.SpringDemo.Mapper;

import org.springframework.stereotype.Component;

import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.dto.User;
import com.example.SpringDemo.dto.UserRequest;
@Component
public class UserMapper {
    public UserEntity toEntity(UserRequest user){
        UserEntity entity=new UserEntity();
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setPassword(user.getPassword());
        return entity;
    }
    public User todto(UserEntity entity){
        User user=new User();
        user.setId(entity.getId());
        user.setName(entity.getName());
        user.setEmail(entity.getEmail());
        return user;
    }
    
}
