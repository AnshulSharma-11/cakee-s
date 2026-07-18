package com.cakeshop.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminCustomerResponse {
    private Long customerProfileId;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String avatarUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
