package com.example.SpringDemo.dto;
import java.time.LocalDateTime;

import lombok.Data;
@Data
public class Transaction{
    private int id;
    private double amount;
    private Long senderid;
    private LocalDateTime createdAt;
    private Long receiverid;
    private String senderName;
    private String receiverName;
    private String category;
    private String merchantName;
}