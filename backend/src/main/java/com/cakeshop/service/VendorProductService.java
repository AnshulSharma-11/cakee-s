package com.cakeshop.service;

import com.cakeshop.dto.product.ProductRequest;
import com.cakeshop.dto.product.ProductResponse;
import com.cakeshop.entity.Product;
import com.cakeshop.entity.Subcategory;
import com.cakeshop.entity.User;
import com.cakeshop.entity.VendorProfile;
import com.cakeshop.entity.enums.ProductStatus;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.ProductRepository;
import com.cakeshop.repository.SubcategoryRepository;
import com.cakeshop.repository.VendorProfileRepository;
import com.cakeshop.repository.spec.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class VendorProductService {

    private final ProductRepository productRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final VendorProfileRepository vendorProfileRepository;

    @Transactional
    public ProductResponse addProduct(User vendorUser, ProductRequest req) {
        VendorProfile vendor = vendorOf(vendorUser);
        Subcategory subcategory = subcategoryRepository.findById(req.getSubcategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found with id: " + req.getSubcategoryId()));

        Product product = Product.builder()
                .vendor(vendor)
                .subcategory(subcategory)
                .name(req.getName())
                .description(req.getDescription())
                .basePrice(req.getBasePrice())
                .imageUrl(req.getImageUrl())
                .status(ProductStatus.PENDING) // every new/edited product goes through admin approval
                .build();

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse editProduct(User vendorUser, Long productId, ProductRequest req) {
        Product product = ownedProductOrThrow(vendorUser, productId);

        Subcategory subcategory = subcategoryRepository.findById(req.getSubcategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found with id: " + req.getSubcategoryId()));

        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setBasePrice(req.getBasePrice());
        product.setImageUrl(req.getImageUrl());
        product.setSubcategory(subcategory);
        product.setStatus(ProductStatus.PENDING); // edits require re-approval

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(User vendorUser, Long productId) {
        Product product = ownedProductOrThrow(vendorUser, productId);
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> listMyProducts(User vendorUser, Long categoryId, Long subcategoryId,
                                                 BigDecimal minPrice, BigDecimal maxPrice,
                                                 ProductStatus status, String keyword, Pageable pageable) {
        VendorProfile vendor = vendorOf(vendorUser);

        Specification<Product> spec = ProductSpecification.build(
                vendor.getId(), categoryId, subcategoryId, minPrice, maxPrice, status, keyword);
        return productRepository.findAll(spec, pageable).map(this::toResponse);
    }

    // ---- helpers ----

    private VendorProfile vendorOf(User user) {
        return vendorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found"));
    }

    private Product ownedProductOrThrow(User vendorUser, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (!product.getVendor().getUser().getId().equals(vendorUser.getId())) {
            throw new AccessDeniedException("You do not own this product");
        }
        return product;
    }

    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .basePrice(p.getBasePrice())
                .imageUrl(p.getImageUrl())
                .status(p.getStatus().name())
                .vendorId(p.getVendor().getId())
                .vendorShopName(p.getVendor().getShopName())
                .subcategoryId(p.getSubcategory().getId())
                .subcategoryName(p.getSubcategory().getName())
                .categoryId(p.getSubcategory().getCategory().getId())
                .categoryName(p.getSubcategory().getCategory().getName())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
