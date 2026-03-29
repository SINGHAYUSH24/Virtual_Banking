package com.example.SpringDemo.dto;

import com.example.SpringDemo.enums.MerchantEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class MerchantRequest {
    @NotNull(message="Account ID cannot be Empty")
    private Long id;
    @NotNull(message="Merchant Name cannot be Empty")
    private String name;
    @NotNull(message="Must Select Valid Merchant Category")
    private MerchantEnum type;
}
