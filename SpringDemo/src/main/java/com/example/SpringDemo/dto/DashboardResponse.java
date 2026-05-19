package com.example.SpringDemo.dto;
import java.util.Map;
import lombok.Data;
@Data
public class DashboardResponse {
    private double totalExpense;
    private double totalIncome;
    private double netIncome;

    private Map<String, Double> topCategories;
    private Map<String, Double> topMerchants;
}
