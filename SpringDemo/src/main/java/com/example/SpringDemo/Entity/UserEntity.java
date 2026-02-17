package com.example.SpringDemo.Entity;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@Entity
@Data
@Table(name="users")
public class UserEntity {
    @Id
    @GeneratedValue
    private int id;
    @Column(nullable=false)
    private String name;
    @Column(nullable=false,unique=true)
    private Long number;
    @Column(nullable=false)
    private String password;
    @OneToMany(mappedBy="user",cascade=CascadeType.ALL,orphanRemoval=true)
    private List<AccountEntity> accounts=new ArrayList<>();
}
