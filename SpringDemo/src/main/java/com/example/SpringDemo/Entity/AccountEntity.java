package com.example.SpringDemo.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@Table(name="accounts")
@NoArgsConstructor
public class AccountEntity{
    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE,generator="account_seq")
    @SequenceGenerator(name="account_seq",sequenceName="my_entity_seq",allocationSize=1)
    private Long id;
    @Column(nullable=false)
    @Min(value=1000,message="Minimum Account Balance cannot be less than Rs. 1000")
    private double balance;
    @Column(nullable=false)
    private String pin;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    private UserEntity user;

}
