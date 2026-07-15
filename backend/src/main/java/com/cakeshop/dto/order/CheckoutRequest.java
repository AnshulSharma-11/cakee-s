package com.cakeshop.dto.order;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CheckoutRequest {
    @NotNull
    private Long addressId;

    @NotNull
    @Future(message = "Delivery date must be in the future")
    private LocalDate deliveryDate;
}
