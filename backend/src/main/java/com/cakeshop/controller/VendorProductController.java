package com.cakeshop.controller;

import com.cakeshop.dto.product.ProductRequest;
import com.cakeshop.dto.product.ProductResponse;
import com.cakeshop.entity.enums.ProductStatus;
import com.cakeshop.security.AuthenticatedUser;
import com.cakeshop.service.VendorProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/vendor/products")
@RequiredArgsConstructor
public class VendorProductController {

    private final VendorProductService vendorProductService;

    @PostMapping
    public ResponseEntity<ProductResponse> addProduct(@AuthenticationPrincipal AuthenticatedUser principal,
                                                        @Valid @RequestBody ProductRequest req) {
        ProductResponse res = vendorProductService.addProduct(principal.getUser(), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/{productId}")
    public ProductResponse editProduct(@AuthenticationPrincipal AuthenticatedUser principal,
                                        @PathVariable Long productId,
                                        @Valid @RequestBody ProductRequest req) {
        return vendorProductService.editProduct(principal.getUser(), productId, req);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@AuthenticationPrincipal AuthenticatedUser principal,
                                               @PathVariable Long productId) {
        vendorProductService.deleteProduct(principal.getUser(), productId);
        return ResponseEntity.noContent().build();
    }

    /**
     * List the authenticated vendor's own products with search/sort/filter.
     * Example: /api/vendor/products?keyword=choco&categoryId=1&minPrice=200&maxPrice=1000
     *          &status=APPROVED&sortBy=basePrice&direction=asc&page=0&size=10
     */
    @GetMapping
    public Page<ProductResponse> listMyProducts(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subcategoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Sort sort = Sort.by(direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return vendorProductService.listMyProducts(
                principal.getUser(), categoryId, subcategoryId, minPrice, maxPrice, status, keyword, pageable);
    }
}
