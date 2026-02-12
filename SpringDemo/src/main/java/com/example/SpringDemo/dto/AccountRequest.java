package com.example.SpringDemo.dto;

import lombok.Data;

@Data
public class AccountRequest {
    private String email;
    private double balance;
    private String pin;
}
