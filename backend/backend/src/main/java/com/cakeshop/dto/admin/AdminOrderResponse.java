package com.cakeshop.dto.admin;

import com.cakeshop.dto.order.DeliveryResponse;
import com.cakeshop.dto.order.OrderItemResponse;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminOrderResponse {
    private Long id;
    private String status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;

    private Long customerId;
    private String customerName;
    private String customerEmail;

    private List<OrderItemResponse> items;
    private DeliveryResponse delivery;
}
