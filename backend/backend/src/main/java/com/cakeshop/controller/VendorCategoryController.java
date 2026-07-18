package com.cakeshop.controller;

import com.cakeshop.dto.category.CategoryRequest;
import com.cakeshop.dto.category.CategoryResponse;
import com.cakeshop.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor/categories")
@RequiredArgsConstructor
public class VendorCategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(req));
    }

    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
        return categoryService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<CategoryResponse> listAll() {
        return categoryService.listAll();
    }
}
