package com.contractiq.backend.config;

import com.contractiq.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication
        .UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority
        .SimpleGrantedAuthority;
import org.springframework.security.core.context
        .SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // skip OPTIONS preflight
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        // skip public routes
        if (isPublicRoute(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // read Authorization header
        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {
            sendUnauthorized(response,
                    "Missing or invalid " +
                            "Authorization header");
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            sendUnauthorized(response,
                    "Invalid or expired token");
            return;
        }

        // extract user info from token
        String email = jwtUtil.extractEmail(token);
        String role  = jwtUtil.extractRole(token);
        String name  = jwtUtil.extractName(token);

        // ── THIS IS THE CRITICAL MISSING PIECE ────────────
        // tell Spring Security this request is authenticated
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(new SimpleGrantedAuthority(
                                role))
                );

        SecurityContextHolder.getContext()
                .setAuthentication(authToken);
        // ──────────────────────────────────────────────────

        // also attach to request attributes for controllers
        request.setAttribute("userEmail", email);
        request.setAttribute("userRole",  role);
        request.setAttribute("userName",  name);
        request.setAttribute("rawToken",  token);

        log.debug("Authenticated user: {} role: {}",
                email, role);

        filterChain.doFilter(request, response);
    }

    private boolean isPublicRoute(String path) {
        return path.startsWith("/api/auth/")
                || path.startsWith("/actuator")
                || path.equals("/error");
    }

    private void sendUnauthorized(
            HttpServletResponse response,
            String message) throws IOException {
        response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setHeader(
                "Access-Control-Allow-Origin", "*");
        response.getWriter().write(
                "{\"error\": \"" + message + "\"}");
    }
}