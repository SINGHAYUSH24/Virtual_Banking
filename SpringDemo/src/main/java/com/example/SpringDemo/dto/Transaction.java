package com.example.SpringDemo.dto;
import com.example.SpringDemo.enums.TransactionEnum;

import lombok.Data;
@Data
public class Transaction{
    private int id;
    private TransactionEnum type;
    private double amount;
}