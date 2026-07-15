package com.cakeshop.dto.cart;

import com.cakeshop.dto.customization.CakeCustomizationRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateCartItemRequest {
    @Min(1)
    private Integer quantity;

    @Valid
    private CakeCustomizationRequest customization;
}
