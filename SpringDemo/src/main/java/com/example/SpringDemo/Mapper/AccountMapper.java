package com.example.SpringDemo.Mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.SpringDemo.Entity.AccountEntity;
import com.example.SpringDemo.Entity.TransactionEntity;
import com.example.SpringDemo.Repository.TransactionRepository;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.AccountsData;
import com.example.SpringDemo.dto.Transaction;
@Component
public class AccountMapper {
    private final TransactionRepository repo;
    public AccountMapper(TransactionRepository repo){
        this.repo=repo;
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
        return tr;
    }
    public AccountResponse todto(AccountEntity entity){
        AccountResponse response=new AccountResponse();
        response.setId(entity.getId());
        response.setBalance(entity.getBalance());
        List<Transaction> list=repo.findBySenderidOrReceiverid(entity.getId(), entity.getId()).stream().map(item->toTransaction(item)).collect(Collectors.toList());
        response.setTransactions(list);
        return response;
    }
    public AccountsData toResponseAccount(AccountEntity entity){
        AccountsData account=new AccountsData();
        account.setId(entity.getId());
        return account;
    }
}
