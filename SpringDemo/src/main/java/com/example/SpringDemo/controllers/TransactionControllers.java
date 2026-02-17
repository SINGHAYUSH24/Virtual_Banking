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
import com.example.SpringDemo.dto.Transaction;
import com.example.SpringDemo.dto.TransactionRequest;

@RestController
@RequestMapping("/payments")
public class TransactionControllers {
    private final AccountService service;
    public TransactionControllers(AccountService service){
        this.service=service;
    }
    @PostMapping("/new")
    public ResponseEntity<String> addTransaction(@RequestBody TransactionRequest transaction){
        int response=service.addTransaction(transaction);
        return ResponseEntity.status(201).body("Payment with Id: "+response+" Successful");
    }
    @GetMapping("/history/{id}")
    public ResponseEntity<List<Transaction>> getTransaction(@PathVariable Long id){
        List<Transaction> data=service.getTransactions(id);
        return ResponseEntity.ok(data);
    }
}
