package com.cakeshop.controller;

import com.cakeshop.dto.admin.AdminOrderResponse;
import com.cakeshop.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public Page<AdminOrderResponse> listAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return adminOrderService.listAllOrders(pageable);
    }

    @GetMapping("/{orderId}")
    public AdminOrderResponse getOrder(@PathVariable Long orderId) {
        return adminOrderService.getOrder(orderId);
    }
}
