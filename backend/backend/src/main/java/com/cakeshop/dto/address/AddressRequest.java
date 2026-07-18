package com.cakeshop.dto.address;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {
    @NotBlank
    private String line1;

    private String line2;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String pincode;

    private Boolean isDefault;
}
