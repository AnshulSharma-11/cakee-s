package com.cakeshop.service;

import com.cakeshop.dto.cart.*;
import com.cakeshop.dto.customization.CakeCustomizationRequest;
import com.cakeshop.dto.customization.CakeCustomizationResponse;
import com.cakeshop.entity.*;
import com.cakeshop.entity.enums.ProductStatus;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponse getMyCart(User customerUser) {
        return toResponse(getOrCreateCart(customerUser));
    }

    @Transactional
    public CartResponse addItem(User customerUser, AddToCartRequest req) {
        Cart cart = getOrCreateCart(customerUser);

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + req.getProductId()));

        if (product.getStatus() != ProductStatus.APPROVED) {
            throw new ResourceNotFoundException("Product not found with id: " + req.getProductId());
        }

        CartItem item = CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(req.getQuantity() == null ? 1 : req.getQuantity())
                .customization(buildCustomization(product, req.getCustomization()))
                .build();

        cartItemRepository.save(item);
        return toResponse(cart);
    }

    @Transactional
    public CartResponse updateItem(User customerUser, Long itemId, UpdateCartItemRequest req) {
        CustomerProfile customer = customerOf(customerUser);
        CartItem item = cartItemRepository.findByIdAndCartCustomerId(itemId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (req.getQuantity() != null) {
            item.setQuantity(req.getQuantity());
        }
        if (req.getCustomization() != null) {
            applyCustomization(item, req.getCustomization());
        }

        cartItemRepository.save(item);
        return toResponse(item.getCart());
    }

    @Transactional
    public CartResponse removeItem(User customerUser, Long itemId) {
        CustomerProfile customer = customerOf(customerUser);
        CartItem item = cartItemRepository.findByIdAndCartCustomerId(itemId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        Cart cart = item.getCart();
        cartItemRepository.delete(item);
        return toResponse(cart);
    }

    @Transactional
    public void clearCart(User customerUser) {
        Cart cart = getOrCreateCart(customerUser);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // ---- helpers ----

    Cart getOrCreateCart(User customerUser) {
        CustomerProfile customer = customerOf(customerUser);
        return cartRepository.findByCustomerId(customer.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().customer(customer).build()));
    }

    private CustomerProfile customerOf(User user) {
        return customerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
    }

    private CakeCustomization buildCustomization(Product product, CakeCustomizationRequest req) {
        if (req == null) return null;
        return CakeCustomization.builder()
                .product(product)
                .weightKg(req.getWeightKg())
                .flavor(req.getFlavor())
                .shape(req.getShape())
                .messageOnCake(req.getMessageOnCake())
                .layers(req.getLayers())
                .specialNotes(req.getSpecialNotes())
                .build();
    }

    private void applyCustomization(CartItem item, CakeCustomizationRequest req) {
        CakeCustomization c = item.getCustomization();
        if (c == null) {
            item.setCustomization(buildCustomization(item.getProduct(), req));
            return;
        }
        c.setWeightKg(req.getWeightKg());
        c.setFlavor(req.getFlavor());
        c.setShape(req.getShape());
        c.setMessageOnCake(req.getMessageOnCake());
        c.setLayers(req.getLayers());
        c.setSpecialNotes(req.getSpecialNotes());
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(this::toItemResponse).toList();
        BigDecimal total = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .totalAmount(total)
                .build();
    }

    private CartItemResponse toItemResponse(CartItem item) {
        BigDecimal unitPrice = item.getProduct().getBasePrice();
        BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImageUrl(item.getProduct().getImageUrl())
                .unitPrice(unitPrice)
                .quantity(item.getQuantity())
                .subtotal(subtotal)
                .customization(toCustomizationResponse(item.getCustomization()))
                .build();
    }

    private CakeCustomizationResponse toCustomizationResponse(CakeCustomization c) {
        if (c == null) return null;
        return CakeCustomizationResponse.builder()
                .id(c.getId())
                .weightKg(c.getWeightKg())
                .flavor(c.getFlavor())
                .shape(c.getShape())
                .messageOnCake(c.getMessageOnCake())
                .layers(c.getLayers())
                .specialNotes(c.getSpecialNotes())
                .build();
    }
}
