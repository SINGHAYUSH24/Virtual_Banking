package com.example.SpringDemo.Repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.SpringDemo.Entity.MerchantApproval;

@Repository
public interface MerchantApprovalRepository extends JpaRepository<MerchantApproval, Integer> {

    // Fetch all pending requests — used by /admin/requests
    @Override
    List<MerchantApproval> findAll();

    // Check if a user already has a pending request
    boolean existsByUserId(int userId);

    // Find a pending request by its id — used by /admin/approve
    Optional<MerchantApproval> findById(int id);
}