package com.usedcarapp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails; // Import UserDetails
import org.springframework.security.core.userdetails.UserDetailsService; // Import UserDetailsService
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Import UsernamePasswordAuthenticationToken

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService; // Inject UserDetailsService

    public JwtAuthenticationFilter(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String jwt = extractJwtFromRequest(request);

        // Validate the JWT and set authentication in the context
        if (jwt != null && validateJwt(jwt)) {
            Authentication authentication = getAuthentication(jwt);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        chain.doFilter(request, response); // Call the next filter in the chain
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }

    private boolean validateJwt(String jwt) {
        try {
            Jws<Claims> claims = Jwts.parser()
                .setSigningKey("5eY!3xQ2@#1mP9oL8rKqV7bC$") // Use your secret key
                .parseClaimsJws(jwt);
            return true; // If parsing is successful, JWT is valid
        } catch (JwtException e) {
            System.out.println("JWT validation failed: " + e.getMessage());
            return false; // JWT is not valid
        }
    }

    private Authentication getAuthentication(String jwt) {
        // Extract user information from the JWT
        String username = Jwts.parser()
            .setSigningKey("5eY!3xQ2@#1mP9oL8rKqV7bC$") // Use your secret key
            .parseClaimsJws(jwt)
            .getBody()
            .getSubject();

        // Load user details from your UserDetailsService
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            return null; // User not found
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
