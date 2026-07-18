package com.cakeshop.dto.profile;

import lombok.Builder;
import lombok.Data;

/**
 * Unified profile response. Vendor-only and customer-only fields are
 * simply null when not applicable to the authenticated user's role.
 */
@Data
@Builder
public class ProfileResponse {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String phone;

    // vendor-only
    private String shopName;
    private String description;
    private String shopAddress;
    private String logoUrl;

    // customer-only
    private String avatarUrl;
}
