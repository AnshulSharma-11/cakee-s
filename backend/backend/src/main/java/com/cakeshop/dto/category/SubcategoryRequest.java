package com.cakeshop.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubcategoryRequest {
    @NotNull
    private Long categoryId;

    @NotBlank
    private String name;
}
