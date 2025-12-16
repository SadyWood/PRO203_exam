package com.ruby.pro203_exam.auth.filter;

import com.ruby.pro203_exam.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
            ) throws ServletException, IOException{

        // Get authorization header
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token (remove "Bearer " prefix)
        String token = authHeader.substring(7);

        try {
            // Validate token and extract claims
            if (jwtService.validateToken(token)) {
                String email = jwtService.extractEmail(token);
                String role = jwtService.extractRole(token);

                // Create authority from role (e.g., ROLE_BOSS, ROLE_STAFF, ROLE_PARENT)
                List<SimpleGrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority("ROLE_" + role)
                );

                // Create authentication token
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(email, null, authorities);

                // Attach request details
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set in security context (makes user available throughout request)
                SecurityContextHolder.getContext().setAuthentication(authToken);

                log.debug("Authenticated user: {} with role: {}", email, role);
            }
        } catch (Exception e) {
            log.error("JWT authentication failed: {}", e.getMessage());
            // Don't set authentication - request will be rejected by security config
        }
        
        filterChain.doFilter(request, response);
    }
}
