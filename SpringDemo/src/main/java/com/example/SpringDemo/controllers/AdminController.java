package com.example.SpringDemo.controllers;
import com.example.SpringDemo.Entity.MerchantApproval;
import com.example.SpringDemo.Service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * GET /admin/requests
     * Returns all pending merchant registration requests.
     *
     * Response 200: List of MerchantRequest objects
     * Response 204: No pending requests found
     */
    @GetMapping("/requests")
    public ResponseEntity<?> getPendingRequests() {
        List<MerchantApproval> requests = adminService.getAllPendingRequests();

        if (requests.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(requests);
    }

    /**
     * DELETE /admin/approve/{id}
     * Approves a merchant request and removes it from the pending table.
     *
     * @param id  path variable — the id of the MerchantRequest to approve
     *
     * Response 200: Approval successful message
     * Response 404: No request found with that id
     */
    @DeleteMapping("/approve/{id}")
    public ResponseEntity<Map<String, String>> approveRequest(@PathVariable int id) {
        try {
            adminService.approveRequest(id);
            return ResponseEntity.ok(
                    Map.of("message", "Merchant request " + id + " Approved.")
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }
}