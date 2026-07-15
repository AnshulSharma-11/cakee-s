package com.cakeshop.dto.customization;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CakeCustomizationRequest {
    private BigDecimal weightKg;
    private String flavor;
    private String shape;
    private String messageOnCake;
    private Integer layers;
    private String specialNotes;
}
