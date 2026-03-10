package com.example.SpringDemo.Repository;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.SpringDemo.Entity.TransactionEntity;
@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity,Integer>{
    Page<TransactionEntity> findBySenderidOrReceiverid(Long senderid,Long Receiverid,Pageable pageable);
    List<TransactionEntity> findBySenderidOrReceiverid(Long senderid,Long receiverid);
}

