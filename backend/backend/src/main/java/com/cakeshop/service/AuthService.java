package com.cakeshop.service;

import com.cakeshop.dto.auth.*;
import com.cakeshop.entity.CustomerProfile;
import com.cakeshop.entity.User;
import com.cakeshop.entity.VendorProfile;
import com.cakeshop.entity.enums.Role;
import com.cakeshop.exception.DuplicateResourceException;
import com.cakeshop.exception.InvalidCredentialsException;
import com.cakeshop.repository.CustomerProfileRepository;
import com.cakeshop.repository.UserRepository;
import com.cakeshop.repository.VendorProfileRepository;
import com.cakeshop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse registerVendor(RegisterVendorRequest req) {
        ensureEmailAvailable(req.getEmail());

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.VENDOR)
                .build();
        user = userRepository.save(user);

        VendorProfile vendor = VendorProfile.builder()
                .user(user)
                .shopName(req.getShopName())
                .shopAddress(req.getShopAddress())
                .phone(req.getPhone())
                .build();
        vendorProfileRepository.save(vendor);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse registerCustomer(RegisterCustomerRequest req) {
        ensureEmailAvailable(req.getEmail());

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.CUSTOMER)
                .build();
        user = userRepository.save(user);

        CustomerProfile customer = CustomerProfile.builder()
                .user(user)
                .phone(req.getPhone())
                .build();
        customerProfileRepository.save(customer);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return buildAuthResponse(user);
    }

    private void ensureEmailAvailable(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with this email already exists");
        }
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
