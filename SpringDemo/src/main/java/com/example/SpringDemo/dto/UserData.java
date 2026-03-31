package com.example.SpringDemo.dto;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class UserData{
    public int id;
    @NotBlank(message="Name cannot be Empty")
    public String name;
    @NotNull(message="Mobile Number cannot be empty")
    @Min(value=1000000000,message="Mobile Number must be 10 digits")
    public Long number;
    private List<AccountResponse> accounts=new ArrayList<>();
}