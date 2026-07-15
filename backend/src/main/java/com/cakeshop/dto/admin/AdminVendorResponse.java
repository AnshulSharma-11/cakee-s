package com.cakeshop.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminVendorResponse {
    private Long vendorProfileId;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String shopName;
    private String description;
    private String shopAddress;
    private String logoUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
