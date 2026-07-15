package com.cakeshop.controller;

import com.cakeshop.dto.order.CheckoutRequest;
import com.cakeshop.dto.order.OrderResponse;
import com.cakeshop.security.AuthenticatedUser;
import com.cakeshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@AuthenticationPrincipal AuthenticatedUser principal,
                                                      @Valid @RequestBody CheckoutRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(principal.getUser(), req));
    }

    @GetMapping
    public List<OrderResponse> listMyOrders(@AuthenticationPrincipal AuthenticatedUser principal) {
        return orderService.listMyOrders(principal.getUser());
    }

    @GetMapping("/{orderId}")
    public OrderResponse getMyOrder(@AuthenticationPrincipal AuthenticatedUser principal, @PathVariable Long orderId) {
        return orderService.getMyOrder(principal.getUser(), orderId);
    }
}
