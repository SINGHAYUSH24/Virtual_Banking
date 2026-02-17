package com.example.SpringDemo.Mapper;

import org.springframework.stereotype.Component;

import com.example.SpringDemo.Entity.UserEntity;
import com.example.SpringDemo.dto.UserData;
import com.example.SpringDemo.dto.CreateUserRequest;
@Component
public class UserMapper {
    public UserEntity toEntity(CreateUserRequest user){
        UserEntity entity=new UserEntity();
        entity.setName(user.getName());
        entity.setNumber(user.getNumber());
        entity.setPassword(user.getPassword());
        return entity;
    }
    public UserData todto(UserEntity entity){
        UserData user=new UserData();
        user.setId(entity.getId());
        user.setName(entity.getName());
        user.setNumber(entity.getNumber());
        return user;
    }
    
}
