package com.cakeshop.controller;

import com.cakeshop.dto.auth.*;
import com.cakeshop.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/vendor")
    public ResponseEntity<AuthResponse> registerVendor(@Valid @RequestBody RegisterVendorRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerVendor(req));
    }

    @PostMapping("/register/customer")
    public ResponseEntity<AuthResponse> registerCustomer(@Valid @RequestBody RegisterCustomerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerCustomer(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    /**
     * JWT is stateless, so "logout" is a client-side token discard.
     * This endpoint exists for a consistent API surface / future blacklist support.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully. Please discard your token."));
    }
}
