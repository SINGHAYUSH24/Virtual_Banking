package com.example.SpringDemo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountBalanceRequest {
    @NotNull(message="Bank Account is a 12-digit Number")
    @Min(value=100000000000L,message="Bank Account is a 12-digit Number")
    @Max(value=999999999999L,message="Bank Account is a 12-digit Number")
    private Long id;
    @NotEmpty(message="UPI PIN cannot be empty")
    @Size(max=4,min=4,message="UPI PIN is a secured 4-digit Number")
    private String pin;
}
