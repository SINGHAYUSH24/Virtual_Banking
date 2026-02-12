package com.example.SpringDemo.controllers;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SpringDemo.Service.UserService;
import com.example.SpringDemo.dto.Login;
import com.example.SpringDemo.dto.User;
import com.example.SpringDemo.dto.UserRequest;
@RestController
@RequestMapping("/user")
public class UserControllers{
    private final UserService service;
    public UserControllers(UserService service){
        this.service=service;
    }
@PostMapping("/signup")
public ResponseEntity<?> createUser(@RequestBody UserRequest user){
    User saved=service.createUser(user);
    return ResponseEntity.status(201).body(saved);
}
@PostMapping("/login")
public ResponseEntity<?> Login(@RequestBody Login user){
    System.out.println(user.getRole());
    service.CredentialsMatch(user);
    return ResponseEntity.ok("Login Successful");
}
@GetMapping("/all")
public ResponseEntity<?> getAll(){
    List<User> users=service.find();
    return ResponseEntity.ok(users);
}
@PutMapping("/update")
public ResponseEntity<?> update(@RequestBody User data){
    User user=service.updatedata(data);
    return ResponseEntity.ok(user);
}
@DeleteMapping("/delete/{id}")
public ResponseEntity<String> delete(@PathVariable int id){
    return ResponseEntity.status(200).body(service.deleteUser(id));
}
}
