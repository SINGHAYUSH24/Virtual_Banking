package com.example.SpringDemo.dto;
import java.time.LocalDateTime;

import com.example.SpringDemo.enums.TransactionEnum;

import lombok.Data;
@Data
public class Transaction{
    private int id;
    private TransactionEnum type;
    private double amount;
    private Long account_id;
    private LocalDateTime createdAt;
    private Long other_id;
}