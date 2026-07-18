package com.cakeshop.controller;

import com.cakeshop.dto.admin.AdminCustomerResponse;
import com.cakeshop.dto.admin.AdminVendorResponse;
import com.cakeshop.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping("/vendors")
    public List<AdminVendorResponse> listVendors() {
        return adminUserService.listVendors();
    }

    @GetMapping("/vendors/{vendorProfileId}")
    public AdminVendorResponse getVendor(@PathVariable Long vendorProfileId) {
        return adminUserService.getVendor(vendorProfileId);
    }

    @GetMapping("/customers")
    public List<AdminCustomerResponse> listCustomers() {
        return adminUserService.listCustomers();
    }

    @GetMapping("/customers/{customerProfileId}")
    public AdminCustomerResponse getCustomer(@PathVariable Long customerProfileId) {
        return adminUserService.getCustomer(customerProfileId);
    }
}
