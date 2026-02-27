package com.example.SpringDemo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.SpringDemo.Entity.TransactionEntity;
@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity,Integer>{
    List<TransactionEntity> findBySenderidOrReceiverid(Long senderid,Long Receiverid);
}
