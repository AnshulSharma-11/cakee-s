package com.cakeshop.repository;

import com.cakeshop.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    Optional<Orders> findByIdAndCustomerId(Long id, Long customerId);
}
