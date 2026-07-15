package com.cakeshop.dto.customization;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CakeCustomizationResponse {
    private Long id;
    private BigDecimal weightKg;
    private String flavor;
    private String shape;
    private String messageOnCake;
    private Integer layers;
    private String specialNotes;
}
