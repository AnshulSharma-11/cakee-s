package com.cakeshop.controller;

import com.cakeshop.dto.vendor.VendorPublicResponse;
import com.cakeshop.service.VendorPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer/vendors")
@RequiredArgsConstructor
public class VendorPublicController {

    private final VendorPublicService vendorPublicService;

    @GetMapping("/{vendorId}")
    public VendorPublicResponse getVendorProfile(@PathVariable Long vendorId) {
        return vendorPublicService.getVendorProfile(vendorId);
    }
}
