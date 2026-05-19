package com.example.SpringDemo.Service;
import com.example.SpringDemo.Entity.MerchantApproval;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.example.SpringDemo.Repository.MerchantApprovalRepository;

@Service
public class AdminService {

    private final MerchantApprovalRepository merchantApprovalRepository;

    public AdminService(MerchantApprovalRepository merchantApprovalRepository) {
        this.merchantApprovalRepository = merchantApprovalRepository;
    }
    public List<MerchantApproval> getAllPendingRequests() {
        return merchantApprovalRepository.findAll();
    }
    @Transactional
    public void approveRequest(int requestId) {
        MerchantApproval request = merchantApprovalRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No pending merchant request found with id: " + requestId));

        merchantApprovalRepository.delete(request);
    }
}