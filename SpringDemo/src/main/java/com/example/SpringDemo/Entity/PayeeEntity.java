package com.example.SpringDemo.Entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="payees")
public class PayeeEntity {
    @Id
    @GeneratedValue
    private int id;

    @Column(nullable=false)
    private int userId; // The owner who registered this payee

    @Column(nullable=false)
    private Long payeeAccountId; // The bank account ID of the recipient

    @Column(nullable=false)
    private String payeeName; // The registered payee name (validated)

    @Column(nullable=false, updatable=false)
    private LocalDateTime createdAt;

    @PrePersist
    void createTimestamp() {
        createdAt = LocalDateTime.now();
    }
}
