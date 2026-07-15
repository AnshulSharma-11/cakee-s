package com.cakeshop.service;

import com.cakeshop.dto.profile.ProfileResponse;
import com.cakeshop.dto.profile.UpdateProfileRequest;
import com.cakeshop.entity.CustomerProfile;
import com.cakeshop.entity.User;
import com.cakeshop.entity.VendorProfile;
import com.cakeshop.entity.enums.Role;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.CustomerProfileRepository;
import com.cakeshop.repository.UserRepository;
import com.cakeshop.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final VendorProfileRepository vendorProfileRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getMyProfile(User user) {
        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name());

        if (user.getRole() == Role.VENDOR) {
            VendorProfile vendor = vendorProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found"));
            builder.phone(vendor.getPhone())
                    .shopName(vendor.getShopName())
                    .description(vendor.getDescription())
                    .shopAddress(vendor.getShopAddress())
                    .logoUrl(vendor.getLogoUrl());
        } else if (user.getRole() == Role.CUSTOMER) {
            CustomerProfile customer = customerProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
            builder.phone(customer.getPhone())
                    .avatarUrl(customer.getAvatarUrl());
        }
        // ADMIN has no extended profile table — base fields only

        return builder.build();
    }

    @Transactional
    public ProfileResponse updateMyProfile(User user, UpdateProfileRequest req) {
        if (req.getName() != null) {
            user.setName(req.getName());
            userRepository.save(user);
        }

        if (user.getRole() == Role.VENDOR) {
            VendorProfile vendor = vendorProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found"));

            if (req.getPhone() != null) vendor.setPhone(req.getPhone());
            if (req.getShopName() != null) vendor.setShopName(req.getShopName());
            if (req.getDescription() != null) vendor.setDescription(req.getDescription());
            if (req.getShopAddress() != null) vendor.setShopAddress(req.getShopAddress());
            if (req.getLogoUrl() != null) vendor.setLogoUrl(req.getLogoUrl());
            vendorProfileRepository.save(vendor);

        } else if (user.getRole() == Role.CUSTOMER) {
            CustomerProfile customer = customerProfileRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));

            if (req.getPhone() != null) customer.setPhone(req.getPhone());
            if (req.getAvatarUrl() != null) customer.setAvatarUrl(req.getAvatarUrl());
            customerProfileRepository.save(customer);
        }

        return getMyProfile(user);
    }
}
