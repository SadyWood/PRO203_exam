package com.ruby.pro203_exam.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    public String generateToken(String email, String role, UUID userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId != null ? userId.toString() : null);

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        String token = Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();

        log.info("Generated token for user: {}", email);
        return token;
    }

    public Claims extractClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return (String) extractClaims(token).get("role");
    }

    public UUID extractUserId(String token) {
        Object userId = extractClaims(token).get("userId");
        if (userId == null) {
            return null;
        }
        if (userId instanceof String) {
            return UUID.fromString((String) userId);
        }
        return null;
    }

    public boolean tokenExpirationCheck(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String email) {
        try {
            return extractClaims(token).getSubject().equals(email) && !tokenExpirationCheck(token);
        } catch (Exception e) {
            log.error("Validation of the token failed: {}", e.getMessage());
            return false;
        }
    }
}
