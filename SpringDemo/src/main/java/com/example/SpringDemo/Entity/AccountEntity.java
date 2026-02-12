package com.example.SpringDemo.Entity;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
    private double balance;
    @Column(nullable=false)
    private String pin;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    private UserEntity user;
    @OneToMany(mappedBy="account",cascade=CascadeType.ALL,orphanRemoval=true)
    private List<TransactionEntity> transactions=new ArrayList<>();

}
