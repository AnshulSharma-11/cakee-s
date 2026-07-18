package com.cakeshop.dto.profile;

import lombok.Data;

/**
 * Fields are optional/partial-update. Only fields relevant to the
 * caller's role are applied by the service layer.
 */
@Data
public class UpdateProfileRequest {
    private String name;
    private String phone;

    // vendor-only
    private String shopName;
    private String description;
    private String shopAddress;
    private String logoUrl;

    // customer-only
    private String avatarUrl;
}
