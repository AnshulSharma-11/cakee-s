package com.cakeshop.dto.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SubcategoryResponse {
    private Long id;
    private String name;
    private Long categoryId;
    private String categoryName;
}
