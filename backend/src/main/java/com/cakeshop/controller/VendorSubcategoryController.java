package com.cakeshop.controller;

import com.cakeshop.dto.category.SubcategoryRequest;
import com.cakeshop.dto.category.SubcategoryResponse;
import com.cakeshop.service.SubcategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor/subcategories")
@RequiredArgsConstructor
public class VendorSubcategoryController {

    private final SubcategoryService subcategoryService;

    @PostMapping
    public ResponseEntity<SubcategoryResponse> create(@Valid @RequestBody SubcategoryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subcategoryService.create(req));
    }

    @PutMapping("/{id}")
    public SubcategoryResponse update(@PathVariable Long id, @Valid @RequestBody SubcategoryRequest req) {
        return subcategoryService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subcategoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<SubcategoryResponse> listAll(@RequestParam(required = false) Long categoryId) {
        return categoryId != null ? subcategoryService.listByCategory(categoryId) : subcategoryService.listAll();
    }
}
