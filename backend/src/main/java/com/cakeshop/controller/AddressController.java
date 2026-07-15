package com.cakeshop.controller;

import com.cakeshop.dto.address.AddressRequest;
import com.cakeshop.dto.address.AddressResponse;
import com.cakeshop.security.AuthenticatedUser;
import com.cakeshop.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressResponse> create(@AuthenticationPrincipal AuthenticatedUser principal,
                                                    @Valid @RequestBody AddressRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.create(principal.getUser(), req));
    }

    @PutMapping("/{id}")
    public AddressResponse update(@AuthenticationPrincipal AuthenticatedUser principal,
                                   @PathVariable Long id, @Valid @RequestBody AddressRequest req) {
        return addressService.update(principal.getUser(), id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal AuthenticatedUser principal, @PathVariable Long id) {
        addressService.delete(principal.getUser(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<AddressResponse> listMine(@AuthenticationPrincipal AuthenticatedUser principal) {
        return addressService.listMine(principal.getUser());
    }
}
