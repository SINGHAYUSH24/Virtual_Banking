package com.example.SpringDemo.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="transactions")
public class TransactionEntity{
    @Id
    @GeneratedValue
    private int id;
    @Column(nullable=false)
    private double amount;
    @Column(nullable=false,updatable=false)
    private LocalDateTime createdAt;
    @Column(nullable=false)
    private Long senderid;
    @Column(nullable=false)
    private Long receiverid;
    @Column(nullable=false)
    private String senderName;
    @Column(nullable=false)
    private String receiverName;
    @PrePersist
    void createTimestamp(){
        createdAt=LocalDateTime.now();
    }
} 
