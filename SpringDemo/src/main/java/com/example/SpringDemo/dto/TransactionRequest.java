package com.example.SpringDemo.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TransactionRequest {
    private double amount;
    private Long account_id;
    private Long receiver_id;
    @Size(min=4,max=4,message="UPI Pin must be 4-digit long")
    private String pin;
}

