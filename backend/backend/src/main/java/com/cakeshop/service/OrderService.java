package com.cakeshop.service;

import com.cakeshop.dto.customization.CakeCustomizationResponse;
import com.cakeshop.dto.order.*;
import com.cakeshop.entity.*;
import com.cakeshop.entity.enums.DeliveryStatus;
import com.cakeshop.entity.enums.OrderStatus;
import com.cakeshop.exception.InvalidOperationException;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.AddressRepository;
import com.cakeshop.repository.CustomerProfileRepository;
import com.cakeshop.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrdersRepository ordersRepository;
    private final AddressRepository addressRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final CartService cartService;

    @Transactional
    public OrderResponse placeOrder(User customerUser, CheckoutRequest req) {
        CustomerProfile customer = customerOf(customerUser);

        Cart cart = cartService.getOrCreateCart(customerUser);
        if (cart.getItems().isEmpty()) {
            throw new InvalidOperationException("Your cart is empty");
        }

        Address address = addressRepository.findByIdAndCustomerId(req.getAddressId(), customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + req.getAddressId()));

        Orders order = Orders.builder()
                .customer(customer)
                .status(OrderStatus.PLACED)
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            BigDecimal unitPrice = cartItem.getProduct().getBasePrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .vendor(cartItem.getProduct().getVendor())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(unitPrice)
                    .customization(copyCustomization(cartItem.getCustomization()))
                    .build();

            order.getItems().add(orderItem);
        }
        order.setTotalAmount(total);

        Delivery delivery = Delivery.builder()
                .order(order)
                .address(address)
                .deliveryDate(req.getDeliveryDate())
                .status(DeliveryStatus.SCHEDULED)
                .build();
        order.setDelivery(delivery);

        Orders saved = ordersRepository.save(order);

        // checkout succeeded — empty the cart
        cartService.clearCart(customerUser);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listMyOrders(User customerUser) {
        CustomerProfile customer = customerOf(customerUser);
        return ordersRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getMyOrder(User customerUser, Long orderId) {
        CustomerProfile customer = customerOf(customerUser);
        Orders order = ordersRepository.findByIdAndCustomerId(orderId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return toResponse(order);
    }

    // ---- helpers ----

    private CustomerProfile customerOf(User user) {
        return customerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
    }

    /** Order items get their own independent copy of the customization (immutable snapshot). */
    private CakeCustomization copyCustomization(CakeCustomization source) {
        if (source == null) return null;
        return CakeCustomization.builder()
                .product(source.getProduct())
                .weightKg(source.getWeightKg())
                .flavor(source.getFlavor())
                .shape(source.getShape())
                .messageOnCake(source.getMessageOnCake())
                .layers(source.getLayers())
                .specialNotes(source.getSpecialNotes())
                .build();
    }

    private OrderResponse toResponse(Orders order) {
        List<OrderItemResponse> items = order.getItems().stream().map(this::toItemResponse).toList();

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

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
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
