package com.cakeshop.service.mapper;

import com.cakeshop.dto.product.ProductResponse;
import com.cakeshop.entity.Product;

public class ProductMapper {

    private ProductMapper() {}

    public static ProductResponse toResponse(Product p) {
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
