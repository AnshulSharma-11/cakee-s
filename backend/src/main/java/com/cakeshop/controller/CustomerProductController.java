package com.cakeshop.controller;

import com.cakeshop.dto.product.ProductResponse;
import com.cakeshop.service.CustomerProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/customer/products")
@RequiredArgsConstructor
public class CustomerProductController {

    private final CustomerProductService customerProductService;

    /**
     * Browse only APPROVED products. Example:
     * /api/customer/products/browse?keyword=red+velvet&categoryId=1&subcategoryId=3
     *   &minPrice=200&maxPrice=1500&sortBy=basePrice&direction=asc&page=0&size=12
     */
    @GetMapping("/browse")
    public Page<ProductResponse> browse(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subcategoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Sort sort = Sort.by(direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return customerProductService.browseApproved(categoryId, subcategoryId, minPrice, maxPrice, keyword, pageable);
    }

    @GetMapping("/{productId}")
    public ProductResponse getOne(@PathVariable Long productId) {
        return customerProductService.getApprovedProductOrThrow(productId);
    }
}
