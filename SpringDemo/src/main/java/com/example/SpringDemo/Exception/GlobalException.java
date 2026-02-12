package com.example.SpringDemo.Exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<String> InvalidCredential(InvalidCredentialException e){
        return ResponseEntity.status(400).body(e.getMessage());
    }
    @ExceptionHandler(NoDataException.class)
    public ResponseEntity<String> NoData(NoDataException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }
    
}
