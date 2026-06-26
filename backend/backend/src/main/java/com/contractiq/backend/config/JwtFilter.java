package com.contractiq.backend.config;

import com.contractiq.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // skip filter for public routes
        if (isPublicRoute(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendUnauthorized(response,
                    "Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            sendUnauthorized(response, "Invalid or expired token");
            return;
        }

        // attach user info to request
        request.setAttribute("userEmail",
                jwtUtil.extractEmail(token));
        request.setAttribute("userRole",
                jwtUtil.extractRole(token));
        request.setAttribute("userName",
                jwtUtil.extractName(token));
        request.setAttribute("rawToken", token);

        filterChain.doFilter(request, response);
    }

    private boolean isPublicRoute(String path) {
        return path.contains("/api/auth/register")
                || path.contains("/api/auth/login")
                || path.contains("/api/auth/verify-otp")
                || path.contains("/api/auth/resend-otp")
                || path.contains("/actuator/health")
                || path.contains("/health");
    }

    private void sendUnauthorized(HttpServletResponse response,
                                  String message)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"error\": \"" + message + "\"}");
    }
}