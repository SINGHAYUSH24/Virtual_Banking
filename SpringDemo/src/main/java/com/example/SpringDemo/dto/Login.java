package com.example.SpringDemo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class Login {
    @NotNull(message="Mobile Number cannot be empty")
    @Min(value=1000000000,message="Mobile Number must be 10 digits")
    private Long number;
    @NotBlank(message="Password not found")
    @Size(min=5,message="Password must be 5 characters long")
    private String password;
}
