package com.example.SpringDemo.Exception;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> NotValid(MethodArgumentNotValidException e){
        List<String> response=e.getBindingResult().getFieldErrors().stream().map(error->error.getDefaultMessage()).collect(Collectors.toList());
        return ResponseEntity.status(400).body(response);
    }
    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<List<String>> InvalidCredential(InvalidCredentialException e){
        List<String> arr=new ArrayList<>();
        arr.add(e.getMessage());
        return ResponseEntity.status(400).body(arr);
    }
    @ExceptionHandler(NoDataException.class)
    public ResponseEntity<String> NoData(NoDataException e){
        return ResponseEntity.status(404).body(e.getMessage());
    }
    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<List<String>> ConstraintVoilation(jakarta.validation.ConstraintViolationException e){
        List<String> response=e.getConstraintViolations().stream().map(error->error.getMessage()).collect(Collectors.toList());
        return ResponseEntity.status(400).body(response);
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleInvalidEnum(HttpMessageNotReadableException ex) {
        return ResponseEntity
                .badRequest()
                .body("Invalid value provided. Please check your input.");
    }
    
}
