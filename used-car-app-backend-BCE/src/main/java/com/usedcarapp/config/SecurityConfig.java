package com.usedcarapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.usedcarapp.entity.CustomUserDetailsEntity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsEntity userDetailsService;

    public SecurityConfig(CustomUserDetailsEntity userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for testing; re-enable for production
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/test", "/users/register", "/users/login", "/api/loan/calculate", "/users/profile","/listings", "/favorites/*", "/favorites"  ).permitAll() // Allow access without authentication
                .anyRequest().authenticated() // Require authentication for other endpoints
            )
            .formLogin(form -> form.disable()) // Disable the default form login
            .cors() // Enable CORS
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class); // Register JWT filter

        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(userDetailsService);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000") // Ensure this matches your frontend origin
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
