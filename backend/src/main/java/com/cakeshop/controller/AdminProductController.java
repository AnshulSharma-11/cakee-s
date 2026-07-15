package com.cakeshop.controller;

import com.cakeshop.dto.product.ProductResponse;
import com.cakeshop.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping("/pending")
    public Page<ProductResponse> listPending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        return adminProductService.listPending(pageable);
    }

    @PutMapping("/{productId}/approve")
    public ProductResponse approve(@PathVariable Long productId) {
        return adminProductService.approve(productId);
    }

    @PutMapping("/{productId}/reject")
    public ProductResponse reject(@PathVariable Long productId) {
        return adminProductService.reject(productId);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> delete(@PathVariable Long productId) {
        adminProductService.delete(productId);
        return ResponseEntity.noContent().build();
    }
}
