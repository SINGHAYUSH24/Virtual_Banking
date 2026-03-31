package com.example.SpringDemo.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Data
@Entity
@Table(name = "merchant_approval")
public class MerchantApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "merchant_name", nullable = false)
    private String merchantName;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "user_id", nullable = false)
    private long userId;
}