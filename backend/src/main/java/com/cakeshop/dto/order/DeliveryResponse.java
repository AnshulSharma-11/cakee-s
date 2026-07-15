package com.cakeshop.dto.order;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DeliveryResponse {
    private Long addressId;
    private String addressSummary;
    private LocalDate deliveryDate;
    private String status;
}
