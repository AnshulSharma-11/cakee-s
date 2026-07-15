package com.cakeshop.service;

import com.cakeshop.dto.admin.AdminCustomerResponse;
import com.cakeshop.dto.admin.AdminVendorResponse;
import com.cakeshop.entity.CustomerProfile;
import com.cakeshop.entity.VendorProfile;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.CustomerProfileRepository;
import com.cakeshop.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final VendorProfileRepository vendorProfileRepository;
    private final CustomerProfileRepository customerProfileRepository;

    @Transactional(readOnly = true)
    public List<AdminVendorResponse> listVendors() {
        return vendorProfileRepository.findAll().stream().map(this::toVendorResponse).toList();
    }

    @Transactional(readOnly = true)
    public AdminVendorResponse getVendor(Long vendorProfileId) {
        VendorProfile vendor = vendorProfileRepository.findById(vendorProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + vendorProfileId));
        return toVendorResponse(vendor);
    }

    @Transactional(readOnly = true)
    public List<AdminCustomerResponse> listCustomers() {
        return customerProfileRepository.findAll().stream().map(this::toCustomerResponse).toList();
    }

    @Transactional(readOnly = true)
    public AdminCustomerResponse getCustomer(Long customerProfileId) {
        CustomerProfile customer = customerProfileRepository.findById(customerProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerProfileId));
        return toCustomerResponse(customer);
    }

    private AdminVendorResponse toVendorResponse(VendorProfile v) {
        return AdminVendorResponse.builder()
                .vendorProfileId(v.getId())
                .userId(v.getUser().getId())
                .name(v.getUser().getName())
                .email(v.getUser().getEmail())
                .phone(v.getPhone())
                .shopName(v.getShopName())
                .description(v.getDescription())
                .shopAddress(v.getShopAddress())
                .logoUrl(v.getLogoUrl())
                .isActive(v.getUser().getIsActive())
                .createdAt(v.getUser().getCreatedAt())
                .build();
    }

    private AdminCustomerResponse toCustomerResponse(CustomerProfile c) {
        return AdminCustomerResponse.builder()
                .customerProfileId(c.getId())
                .userId(c.getUser().getId())
                .name(c.getUser().getName())
                .email(c.getUser().getEmail())
                .phone(c.getPhone())
                .avatarUrl(c.getAvatarUrl())
                .isActive(c.getUser().getIsActive())
                .createdAt(c.getUser().getCreatedAt())
                .build();
    }
}
