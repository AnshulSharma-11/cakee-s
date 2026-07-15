package com.cakeshop.dto.cart;

import com.cakeshop.dto.customization.CakeCustomizationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartRequest {
    @NotNull
    private Long productId;

    @Min(1)
    private Integer quantity = 1;

    @Valid
    private CakeCustomizationRequest customization;
}
