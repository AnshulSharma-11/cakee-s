package com.cakeshop.repository;

import com.cakeshop.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    List<Subcategory> findByCategoryId(Long categoryId);
    boolean existsByCategoryIdAndNameIgnoreCase(Long categoryId, String name);
}
