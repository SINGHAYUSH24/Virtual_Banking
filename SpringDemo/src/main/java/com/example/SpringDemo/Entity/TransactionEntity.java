package com.example.SpringDemo.Entity;

import java.time.LocalDateTime;

import com.example.SpringDemo.enums.TransactionEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    @Enumerated(EnumType.STRING)
    private TransactionEnum type;
    @Column(nullable=false)
    private double amount;
    @Column(nullable=false,updatable=false)
    private LocalDateTime createdAt;
    @Column(nullable=false)
    private Long other_id;
    @PrePersist
    void createTimestamp(){
        createdAt=LocalDateTime.now();
    }
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="account_id")
    private AccountEntity account;
} 
