package com.example.SpringDemo.Exception;

public class InvalidCredentialException extends RuntimeException {
    public InvalidCredentialException(String message){
        super(message);
    } 
}
