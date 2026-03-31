package com.example.SpringDemo.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SpringDemo.Service.AccountService;
import com.example.SpringDemo.dto.AccountBalanceRequest;
import com.example.SpringDemo.dto.AccountBalanceResponse;
import com.example.SpringDemo.dto.AccountRequest;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.MerchantRequest;
import com.example.SpringDemo.enums.MerchantEnum;

@RestController
@RequestMapping("/account")
public class AccountControllers {
    private  final AccountService service;
    public AccountControllers(AccountService service){
        this.service=service;   
    }
    @GetMapping("/merchants/categories")
    public ResponseEntity<List<String>> getCategories(){
        List<String> categories=Arrays.stream(MerchantEnum.values()).map(category->category.toString().replace("_"," ")).collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }
    @PostMapping("/request")
    public ResponseEntity<String> merchantRequest(@RequestBody MerchantRequest request){
        return ResponseEntity.ok(service.merchantRequest(request));
    }
    @PostMapping("/new")
    public ResponseEntity<String> createAccount(@RequestBody AccountRequest request){
        String response=service.createAccount(request);
        return ResponseEntity.status(201).body(response);
    }
    @GetMapping("/all/{number}")
    public ResponseEntity<List<AccountResponse>> getAll(@PathVariable Long number){
        List<AccountResponse> response=service.getAll(number);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/all")
    public ResponseEntity<List<AccountResponse>> getAllAccounts(){
        List<AccountResponse> data=service.getAllAccounts();
        return ResponseEntity.ok(data);

    }@GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable Long id){
        AccountResponse data=service.getAccount(id);
        return ResponseEntity.ok(data);
    }
    @PostMapping("/balance")
    public ResponseEntity<AccountBalanceResponse> getBalance(@RequestBody AccountBalanceRequest request){
        return ResponseEntity.ok(service.getBalance(request));

    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> removeAccount(@PathVariable Long id){
        String response=service.removeAccount(id);
        return ResponseEntity.ok(response);
    }
}
