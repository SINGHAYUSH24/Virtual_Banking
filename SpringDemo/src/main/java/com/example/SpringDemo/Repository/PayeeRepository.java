package com.example.SpringDemo.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.SpringDemo.Entity.PayeeEntity;

@Repository
public interface PayeeRepository extends JpaRepository<PayeeEntity, Integer> {
    List<PayeeEntity> findByUserId(int userId);
    Optional<PayeeEntity> findByUserIdAndPayeeAccountId(int userId, Long payeeAccountId);
}
