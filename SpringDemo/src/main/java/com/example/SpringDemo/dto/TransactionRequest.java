package com.example.SpringDemo.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private double amount;
    private Long account_id;
    private Long receiver_id;
}

