package com.example.SpringDemo.Map;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.SpringDemo.Exception.InvalidCredentialException;
@Component
public class BankMap{
    Map<Integer,String> bankMap;
    public BankMap(){
        bankMap=new HashMap<>();
        bankMap.put(1, "State Bank of India");
        bankMap.put(2, "HDFC Bank");
        bankMap.put(3, "ICICI Bank");
        bankMap.put(4, "Axis Bank");
        bankMap.put(5, "Punjab National Bank");
        bankMap.put(6, "Bank of Baroda");
        bankMap.put(7, "Canara Bank");
        bankMap.put(8, "Union Bank of India");
        bankMap.put(9, "Kotak Mahindra Bank");
        bankMap.put(10, "Yes Bank");
        bankMap.put(11, "IndusInd Bank");
        bankMap.put(12, "Federal Bank");
        bankMap.put(13, "RBL Bank");
        bankMap.put(14, "AU Small Finance Bank");
        bankMap.put(15, "Equitas Small Finance Bank");
        bankMap.put(16, "Ujjivan Small Finance Bank");
        bankMap.put(17, "Paytm Payments Bank");
        bankMap.put(18, "Airtel Payments Bank");
        bankMap.put(19, "India Post Payments Bank");
        bankMap.put(20, "DBS Bank India");
    }
    public String getBank(int id){
        if(bankMap.containsKey(id)){
            return bankMap.get(id);
        }
        throw new InvalidCredentialException("Invalid Bank Code");
    }
}