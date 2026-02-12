package com.example.SpringDemo.dto;

import lombok.Data;

@Data
public class Login {
    private String email;
    private String password;
    private String role;
}
