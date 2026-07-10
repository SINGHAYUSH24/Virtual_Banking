package com.example.SpringDemo.dto;

import lombok.Data;

@Data
public class PayeeRequest {
    private Long payeeAccountId;
    private String payeeName;
}
