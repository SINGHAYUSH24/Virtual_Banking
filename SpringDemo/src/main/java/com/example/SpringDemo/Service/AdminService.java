package com.example.SpringDemo.Service;
import com.example.SpringDemo.Entity.MerchantApproval;
import com.example.SpringDemo.Entity.AccountEntity;
import com.example.SpringDemo.Repository.AccountRepository;
import com.example.SpringDemo.Repository.MerchantApprovalRepository;
import com.example.SpringDemo.enums.MerchantEnum;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final MerchantApprovalRepository merchantApprovalRepository;
    private final AccountRepository accountRepository;

    public AdminService(MerchantApprovalRepository merchantApprovalRepository, AccountRepository accountRepository) {
        this.merchantApprovalRepository = merchantApprovalRepository;
        this.accountRepository = accountRepository;
    }
    public List<MerchantApproval> getAllPendingRequests() {
        return merchantApprovalRepository.findAll();
    }
    @Transactional
    public void approveRequest(int requestId) {
        MerchantApproval request = merchantApprovalRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No pending merchant request found with id: " + requestId));

        AccountEntity account = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No bank account found with id: " + request.getUserId()));

        String normCategory = request.getCategory().trim().replace(" ", "_").toUpperCase();
        try {
            account.setType(MerchantEnum.valueOf(normCategory));
        } catch (IllegalArgumentException e) {
            account.setType(MerchantEnum.SERVICES);
        }
        account.setMerchant_name(request.getMerchantName());
        accountRepository.save(account);

        merchantApprovalRepository.delete(request);
    }
    @Transactional
    public void rejectRequest(int requestId) {
        MerchantApproval request = merchantApprovalRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No pending merchant request found with id: " + requestId));
        merchantApprovalRepository.delete(request);
    }
}