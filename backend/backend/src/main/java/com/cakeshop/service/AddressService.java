package com.cakeshop.service;

import com.cakeshop.dto.address.AddressRequest;
import com.cakeshop.dto.address.AddressResponse;
import com.cakeshop.entity.Address;
import com.cakeshop.entity.CustomerProfile;
import com.cakeshop.entity.User;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.AddressRepository;
import com.cakeshop.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final CustomerProfileRepository customerProfileRepository;

    @Transactional
    public AddressResponse create(User customerUser, AddressRequest req) {
        CustomerProfile customer = customerOf(customerUser);

        Address address = Address.builder()
                .customer(customer)
                .line1(req.getLine1())
                .line2(req.getLine2())
                .city(req.getCity())
                .state(req.getState())
                .pincode(req.getPincode())
                .isDefault(Boolean.TRUE.equals(req.getIsDefault()))
                .build();

        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public AddressResponse update(User customerUser, Long addressId, AddressRequest req) {
        Address address = ownedAddressOrThrow(customerUser, addressId);

        address.setLine1(req.getLine1());
        address.setLine2(req.getLine2());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setPincode(req.getPincode());
        if (req.getIsDefault() != null) address.setIsDefault(req.getIsDefault());

        return toResponse(addressRepository.save(address));
    }

    @Transactional
    public void delete(User customerUser, Long addressId) {
        Address address = ownedAddressOrThrow(customerUser, addressId);
        addressRepository.delete(address);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> listMine(User customerUser) {
        CustomerProfile customer = customerOf(customerUser);
        return addressRepository.findByCustomerId(customer.getId()).stream().map(this::toResponse).toList();
    }

    private CustomerProfile customerOf(User user) {
        return customerProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
    }

    private Address ownedAddressOrThrow(User customerUser, Long addressId) {
        CustomerProfile customer = customerOf(customerUser);
        return addressRepository.findByIdAndCustomerId(addressId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));
    }

    private AddressResponse toResponse(Address a) {
        return AddressResponse.builder()
                .id(a.getId())
                .line1(a.getLine1())
                .line2(a.getLine2())
                .city(a.getCity())
                .state(a.getState())
                .pincode(a.getPincode())
                .isDefault(a.getIsDefault())
                .build();
    }
}
