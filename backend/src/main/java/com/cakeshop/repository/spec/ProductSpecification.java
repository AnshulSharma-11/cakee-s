package com.cakeshop.repository.spec;

import com.cakeshop.entity.Product;
import com.cakeshop.entity.enums.ProductStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    private ProductSpecification() {}

    public static Specification<Product> build(Long vendorId, Long categoryId, Long subcategoryId,
                                                 BigDecimal minPrice, BigDecimal maxPrice,
                                                 ProductStatus status, String keyword) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (vendorId != null) {
                predicates.add(cb.equal(root.get("vendor").get("id"), vendorId));
            }
            if (subcategoryId != null) {
                predicates.add(cb.equal(root.get("subcategory").get("id"), subcategoryId));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("subcategory").get("category").get("id"), categoryId));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
