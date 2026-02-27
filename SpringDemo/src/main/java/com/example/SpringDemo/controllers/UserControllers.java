package com.example.SpringDemo.controllers;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.SpringDemo.Security.Jwt;
import com.example.SpringDemo.Service.UserService;
import com.example.SpringDemo.dto.CreateUserRequest;
import com.example.SpringDemo.dto.Login;
import com.example.SpringDemo.dto.UserData;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/user")
public class UserControllers{
    private final UserService service;
    private final AuthenticationManager authManager;
    private final Jwt jwt;
    public UserControllers(UserService service,AuthenticationManager authManager,Jwt jwt){
        this.service=service;
        this.authManager=authManager;
        this.jwt=jwt;
    }
@PostMapping("/signup")
public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest user){
    UserData saved=service.createUser(user);
    return ResponseEntity.status(201).body(saved);
}
@PostMapping("/login")
public String Login(@Valid @RequestBody Login user){
    authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getNumber(),user.getPassword()));
    return jwt.generateToken(user.getNumber());
}
@GetMapping("/profile")
public UserData getUserData(){
    UserData user=service.getUserData();
    return user;
}
@GetMapping("/all")
public ResponseEntity<?> getAll(){
    List<UserData> users=service.findAll();
    return ResponseEntity.ok(users);
}
@PutMapping("/update")
public ResponseEntity<?> update(@Valid @RequestBody UserData data){
    UserData user=service.updatedata(data);
    return ResponseEntity.ok(user);
}
@DeleteMapping("/delete/{id}")
public ResponseEntity<String> delete(@PathVariable int id){
    return ResponseEntity.status(200).body(service.deleteUser(id));
}
}
