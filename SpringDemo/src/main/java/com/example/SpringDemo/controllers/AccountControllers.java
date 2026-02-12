package com.example.SpringDemo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SpringDemo.Service.AccountService;
import com.example.SpringDemo.dto.AccountRequest;
import com.example.SpringDemo.dto.AccountResponse;

@RestController
@RequestMapping("/account")
public class AccountControllers {
    private  final AccountService service;
    public AccountControllers(AccountService service){
        this.service=service;   
    }
    @PostMapping("/new")
    public ResponseEntity<String> createAccount(@RequestBody AccountRequest request){
        String response=service.createAccount(request);
        return ResponseEntity.status(201).body(response);
    }
    @GetMapping("/all/{email}")
    public ResponseEntity<List<AccountResponse>> getAll(@PathVariable String email){
        List<AccountResponse> response=service.getAll(email);
        return ResponseEntity.ok(response);
    }
}
