package com.cakeshop.dto.order;

import com.cakeshop.dto.customization.CakeCustomizationResponse;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long vendorId;
    private String vendorShopName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private CakeCustomizationResponse customization;
}
