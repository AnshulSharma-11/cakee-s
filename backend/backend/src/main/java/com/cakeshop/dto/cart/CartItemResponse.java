package com.cakeshop.dto.cart;

import com.cakeshop.dto.customization.CakeCustomizationResponse;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private CakeCustomizationResponse customization;
}
