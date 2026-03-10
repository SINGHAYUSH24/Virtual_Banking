package com.example.SpringDemo.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<Transaction> addTransaction(@RequestBody TransactionRequest transaction){
        System.out.println("EndPoint Hit");
        Transaction response=service.addTransaction(transaction);
        return ResponseEntity.status(201).body(response);
    }
    @GetMapping("/history/{id}")
    public ResponseEntity<Page<Transaction>> getTransaction(@PathVariable Long id,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="10") int size){
        Page<Transaction> data=service.getTransactions(id,page,size);
        return ResponseEntity.ok(data);
    }
}
