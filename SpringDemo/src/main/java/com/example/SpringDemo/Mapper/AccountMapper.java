package com.example.SpringDemo.Mapper;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.SpringDemo.Entity.AccountEntity;
import com.example.SpringDemo.Entity.TransactionEntity;
import com.example.SpringDemo.Exception.InvalidCredentialException;
import com.example.SpringDemo.Repository.AccountRepository;
import com.example.SpringDemo.Repository.TransactionRepository;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.Transaction;
@Component
public class AccountMapper {
    private final TransactionRepository repo;
    private final AccountRepository acc;
    public AccountMapper(TransactionRepository repo,AccountRepository acc){
        this.repo=repo;
        this.acc=acc;
    }
    public Transaction toTransaction(TransactionEntity trans){
        Transaction tr=new Transaction();
        tr.setId(trans.getId());
        tr.setAmount(trans.getAmount());
        tr.setCreatedAt(trans.getCreatedAt());
        tr.setSenderid(trans.getSenderid());
        tr.setReceiverid(trans.getReceiverid());
        tr.setSenderName(trans.getSenderName());
        tr.setReceiverName(trans.getReceiverName());
        AccountEntity account=acc.findById(trans.getReceiverid()).orElseThrow(()->new InvalidCredentialException("Invalid UPI Account"));
        String type=account.getType().toString();
        String category=Arrays.stream(type.split("_")).map(word->word.charAt(0)+word.substring(1).toLowerCase()).collect(Collectors.joining());
        tr.setCategory(category);
        tr.setMerchantName(account.getMerchant_name());
        return tr;
    }
    public AccountResponse todto(AccountEntity entity){
        AccountResponse response=new AccountResponse();
        response.setId(entity.getId());
        response.setBalance(entity.getBalance());
        response.setBankName(entity.getBankname());
        List<Transaction> list=repo.findBySenderidOrReceiverid(entity.getId(), entity.getId()).stream().map(item->toTransaction(item)).collect(Collectors.toList());
        response.setTransactions(list);
        return response;
    }
    public AccountResponse toResponseAccount(AccountEntity entity){
        AccountResponse account=new AccountResponse();
        account.setId(entity.getId());
        account.setBalance(entity.getBalance());
        account.setBankName(entity.getBankname());
        return account;
    }
}
