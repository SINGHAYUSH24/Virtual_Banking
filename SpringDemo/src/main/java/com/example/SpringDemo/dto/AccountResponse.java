package com.example.SpringDemo.dto;
import java.util.List;
import lombok.Data;

@Data
public class AccountResponse {
    private Long id;
    private double balance;
    private List<Transaction> transactions;
}
