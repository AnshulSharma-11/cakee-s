package com.cakeshop.controller;

import com.cakeshop.dto.cart.AddToCartRequest;
import com.cakeshop.dto.cart.CartResponse;
import com.cakeshop.dto.cart.UpdateCartItemRequest;
import com.cakeshop.security.AuthenticatedUser;
import com.cakeshop.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getMyCart(@AuthenticationPrincipal AuthenticatedUser principal) {
        return cartService.getMyCart(principal.getUser());
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@AuthenticationPrincipal AuthenticatedUser principal,
                                                 @Valid @RequestBody AddToCartRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cartService.addItem(principal.getUser(), req));
    }

    @PutMapping("/items/{itemId}")
    public CartResponse updateItem(@AuthenticationPrincipal AuthenticatedUser principal,
                                    @PathVariable Long itemId,
                                    @Valid @RequestBody UpdateCartItemRequest req) {
        return cartService.updateItem(principal.getUser(), itemId, req);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(@AuthenticationPrincipal AuthenticatedUser principal, @PathVariable Long itemId) {
        return cartService.removeItem(principal.getUser(), itemId);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal AuthenticatedUser principal) {
        cartService.clearCart(principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
