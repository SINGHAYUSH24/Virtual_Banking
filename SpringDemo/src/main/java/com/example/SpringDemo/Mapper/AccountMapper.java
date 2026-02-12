package com.example.SpringDemo.Mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.SpringDemo.Entity.AccountEntity;
import com.example.SpringDemo.Entity.TransactionEntity;
import com.example.SpringDemo.dto.AccountResponse;
import com.example.SpringDemo.dto.Transaction;
@Component
public class AccountMapper {
    public Transaction toTransaction(TransactionEntity trans){
        Transaction tr=new Transaction();
        tr.setId(trans.getId());
        tr.setAmount(trans.getAmount());
        tr.setType(trans.getType());
        return tr;
    }
    public AccountResponse todto(AccountEntity entity){
        AccountResponse response=new AccountResponse();
        AccountMapper map=new AccountMapper();
        response.setId(entity.getId());
        response.setBalance(entity.getBalance());
        List<Transaction> transactions=entity.getTransactions().stream().map(item->map.toTransaction(item)).collect(Collectors.toList());
        response.setTransactions(transactions);
        return response;
    }
}
