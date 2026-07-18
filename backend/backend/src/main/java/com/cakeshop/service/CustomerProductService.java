package com.cakeshop.service;

import com.cakeshop.dto.product.ProductResponse;
import com.cakeshop.entity.Product;
import com.cakeshop.entity.enums.ProductStatus;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.ProductRepository;
import com.cakeshop.repository.spec.ProductSpecification;
import com.cakeshop.service.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CustomerProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> browseApproved(Long categoryId, Long subcategoryId,
                                                 BigDecimal minPrice, BigDecimal maxPrice,
                                                 String keyword, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.build(
                null, categoryId, subcategoryId, minPrice, maxPrice, ProductStatus.APPROVED, keyword);
        return productRepository.findAll(spec, pageable).map(ProductMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getApprovedProductOrThrow(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (product.getStatus() != ProductStatus.APPROVED) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        return ProductMapper.toResponse(product);
    }
}
