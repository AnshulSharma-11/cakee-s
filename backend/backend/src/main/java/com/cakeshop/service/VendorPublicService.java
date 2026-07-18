package com.cakeshop.service;

import com.cakeshop.dto.vendor.VendorPublicResponse;
import com.cakeshop.entity.Product;
import com.cakeshop.entity.VendorProfile;
import com.cakeshop.entity.enums.ProductStatus;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.ProductRepository;
import com.cakeshop.repository.VendorProfileRepository;
import com.cakeshop.repository.spec.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VendorPublicService {

    private final VendorProfileRepository vendorProfileRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public VendorPublicResponse getVendorProfile(Long vendorId) {
        VendorProfile vendor = vendorProfileRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + vendorId));

        Specification<Product> approvedByVendor = ProductSpecification.build(
                vendor.getId(), null, null, null, null, ProductStatus.APPROVED, null);
        long approvedCount = productRepository.count(approvedByVendor);

        return VendorPublicResponse.builder()
                .vendorId(vendor.getId())
                .shopName(vendor.getShopName())
                .description(vendor.getDescription())
                .shopAddress(vendor.getShopAddress())
                .logoUrl(vendor.getLogoUrl())
                .approvedProductCount(approvedCount)
                .build();
    }
}
