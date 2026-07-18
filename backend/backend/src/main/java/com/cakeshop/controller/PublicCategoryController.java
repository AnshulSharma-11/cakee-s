package com.cakeshop.controller;

import com.cakeshop.dto.category.CategoryResponse;
import com.cakeshop.dto.category.SubcategoryResponse;
import com.cakeshop.service.CategoryService;
import com.cakeshop.service.SubcategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Read-only taxonomy for the public storefront, so category/subcategory
 * filters on the pre-login catalog don't need to be derived client-side
 * from a broad product browse call.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final CategoryService categoryService;
    private final SubcategoryService subcategoryService;

    @GetMapping("/categories")
    public List<CategoryResponse> listCategories() {
        return categoryService.listAll();
    }

    @GetMapping("/subcategories")
    public List<SubcategoryResponse> listSubcategories(@RequestParam(required = false) Long categoryId) {
        return categoryId != null ? subcategoryService.listByCategory(categoryId) : subcategoryService.listAll();
    }
}
