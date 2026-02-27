package com.example.SpringDemo.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.SpringDemo.Entity.AccountEntity;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity,Integer> {
    Optional<AccountEntity> findById(Long id);
    void deleteById(Long id);
}
