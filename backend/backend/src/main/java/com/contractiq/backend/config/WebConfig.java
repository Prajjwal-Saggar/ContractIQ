package com.contractiq.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet
        .FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation
        .CorsRegistry;
import org.springframework.web.servlet.config.annotation
        .WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final JwtFilter jwtFilter;

    @Bean
    public FilterRegistrationBean<JwtFilter>
    registerJwtFilter() {

        FilterRegistrationBean<JwtFilter> registration =
                new FilterRegistrationBean<>();
        registration.setFilter(jwtFilter);
        registration.addUrlPatterns("/api/*");
        registration.setOrder(1);
        return registration;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173",
                        "http://127.0.0.1:3000",
                        "http://127.0.0.1:5173"
                )
                .allowedMethods(
                        "GET", "POST", "PUT",
                        "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}