package com.cakeshop.service;

import com.cakeshop.dto.admin.AdminOrderResponse;
import com.cakeshop.dto.customization.CakeCustomizationResponse;
import com.cakeshop.dto.order.DeliveryResponse;
import com.cakeshop.dto.order.OrderItemResponse;
import com.cakeshop.entity.*;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrdersRepository ordersRepository;

    @Transactional(readOnly = true)
    public Page<AdminOrderResponse> listAllOrders(Pageable pageable) {
        return ordersRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public AdminOrderResponse getOrder(Long orderId) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return toResponse(order);
    }

    private AdminOrderResponse toResponse(Orders order) {
        var items = order.getItems().stream().map(this::toItemResponse).toList();

        DeliveryResponse deliveryResponse = null;
        if (order.getDelivery() != null) {
            Delivery d = order.getDelivery();
            Address a = d.getAddress();
            deliveryResponse = DeliveryResponse.builder()
                    .addressId(a.getId())
                    .addressSummary(a.getLine1() + ", " + a.getCity() + ", " + a.getState() + " - " + a.getPincode())
                    .deliveryDate(d.getDeliveryDate())
                    .status(d.getStatus().name())
                    .build();
        }

        User customerUser = order.getCustomer().getUser();

        return AdminOrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .customerId(order.getCustomer().getId())
                .customerName(customerUser.getName())
                .customerEmail(customerUser.getEmail())
                .items(items)
                .delivery(deliveryResponse)
                .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        CakeCustomization c = item.getCustomization();

        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .vendorId(item.getVendor().getId())
                .vendorShopName(item.getVendor().getShopName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(subtotal)
                .customization(c == null ? null : CakeCustomizationResponse.builder()
                        .id(c.getId())
                        .weightKg(c.getWeightKg())
                        .flavor(c.getFlavor())
                        .shape(c.getShape())
                        .messageOnCake(c.getMessageOnCake())
                        .layers(c.getLayers())
                        .specialNotes(c.getSpecialNotes())
                        .build())
                .build();
    }
}
