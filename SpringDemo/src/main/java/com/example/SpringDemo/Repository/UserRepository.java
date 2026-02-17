package com.example.SpringDemo.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.SpringDemo.Entity.UserEntity;
public interface UserRepository extends JpaRepository<UserEntity,Integer> {
    Boolean existsByNumber(Long Number);
    Optional<UserEntity> findByNumber(Long number);
    UserEntity findById(int id);
    
    
}
