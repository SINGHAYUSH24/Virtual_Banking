package com.example.SpringDemo.Entity;

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
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="account_id")
    private AccountEntity account;
} 
