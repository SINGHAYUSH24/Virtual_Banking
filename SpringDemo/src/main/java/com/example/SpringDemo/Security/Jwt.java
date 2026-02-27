package com.example.SpringDemo.Security;
import java.util.Date;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class Jwt {

    private static final String SECRET =
            "jwt-secret-key-must-be-at-least-32-characters-long";

    private static final long EXPIRY = 1000 * 60 * 60; 

    public String generateToken(Long number) {
        return Jwts.builder()
                .setSubject(number.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRY))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }
    public Long verifyToken(String token) {
        return Long.parseLong(
                Jwts.parserBuilder()
                        .setSigningKey(SECRET.getBytes())
                        .build()
                        .parseClaimsJws(token)
                        .getBody()
                        .getSubject()
        );
    }
}