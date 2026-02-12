package com.example.SpringDemo.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.SpringDemo.Entity.UserEntity;
public interface UserRepository extends JpaRepository<UserEntity,Integer> {
    Boolean existsByEmail(String email);
    Optional<UserEntity> findByEmail(String email);
    UserEntity findById(int id);
    
    
}
