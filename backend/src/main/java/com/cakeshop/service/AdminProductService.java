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

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> listPending(Pageable pageable) {
        Specification<Product> spec = ProductSpecification.build(
                null, null, null, null, null, ProductStatus.PENDING, null);
        return productRepository.findAll(spec, pageable).map(ProductMapper::toResponse);
    }

    @Transactional
    public ProductResponse approve(Long productId) {
        Product product = getOrThrow(productId);
        product.setStatus(ProductStatus.APPROVED);
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse reject(Long productId) {
        Product product = getOrThrow(productId);
        product.setStatus(ProductStatus.REJECTED);
        return ProductMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long productId) {
        Product product = getOrThrow(productId);
        productRepository.delete(product);
    }

    private Product getOrThrow(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }
}
