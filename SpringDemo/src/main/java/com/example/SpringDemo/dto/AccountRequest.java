package com.example.SpringDemo.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AccountRequest {
    @NotNull(message="Mobile Number is Empty")
    @Min(value=100000000,message="Mobile number contain 10 digits")
    private Long number;
    @Min(value=1000,message="Minimum Allowed Balance is Rs.1000")
    private double balance;
    @Size(min=4,max=4,message="Mobile Banking PIN must be a 4-digit Number")
    private String pin;
    @NotNull(message="Must Specify the Bank Name")
    private int bankcode;
}
