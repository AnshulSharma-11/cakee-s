package com.cakeshop.dto.product;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private String imageUrl;
    private String status;

    private Long vendorId;
    private String vendorShopName;

    private Long subcategoryId;
    private String subcategoryName;
    private Long categoryId;
    private String categoryName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
