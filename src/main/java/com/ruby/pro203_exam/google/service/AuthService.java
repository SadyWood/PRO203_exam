package com.ruby.pro203_exam.google.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ruby.pro203_exam.google.config.SecurityConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.List;

@Service
@Slf4j
public class AuthService {

    private final SecurityConfig.GoogleClientConfig googleClientConfig;

    public AuthService(SecurityConfig.GoogleClientConfig googleClientConfig) {
        this.googleClientConfig = googleClientConfig;
    }

    public GoogleIdToken.Payload verifyToken(String idTokenString)
        throws GeneralSecurityException, IOException {
        log.debug("Verifying token");

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance())
                        .setAudience(googleClientConfig.getClientIds())
                        .build();
        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            if (payload != null) {
                log.debug("Verified token for user: {}", payload.getEmail());
                return payload;
            }else {
                log.debug("Payload is null");
                throw new SecurityException("Payload is null");
            }
        }else {
            log.error("Invalid token");
            throw new SecurityException("Invalid token");
        }
    }

    public UserInfoFromGoogle extractUserInfo(GoogleIdToken.Payload payload){
        return UserInfoFromGoogle.builder()
                .email(payload.getEmail())
                .googleId(payload.getSubject())
                .name((String) payload.get("name"))
                .profilePictureUrl((String) payload.get("picture"))
                .emailVerified(payload.getEmailVerified())
                .build();
    }

    @lombok.Data
    @lombok.Builder
    public static class UserInfoFromGoogle {
        private String email;
        private String googleId;
        private String name;
        private String profilePictureUrl;
        private boolean emailVerified;
    }
}
