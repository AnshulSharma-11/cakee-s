package com.cakeshop.dto.vendor;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VendorPublicResponse {
    private Long vendorId;
    private String shopName;
    private String description;
    private String shopAddress;
    private String logoUrl;
    private long approvedProductCount;
}
