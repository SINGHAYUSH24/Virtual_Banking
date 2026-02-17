package com.example.SpringDemo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotBlank(message="Name cannot be Empty")
    public  String name;
    @NotNull(message="Mobile Number cannot be empty")
    @Min(value=100000000,message="Mobile number contain 10 digits")
    public Long number;
    @NotBlank(message="Password not found")
    @Size(min=5,message="Password must contain atleast 5 characters")
    public String password;
}
