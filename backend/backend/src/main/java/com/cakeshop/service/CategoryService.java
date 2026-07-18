package com.cakeshop.service;

import com.cakeshop.dto.category.CategoryRequest;
import com.cakeshop.dto.category.CategoryResponse;
import com.cakeshop.entity.Category;
import com.cakeshop.exception.DuplicateResourceException;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        if (categoryRepository.existsByNameIgnoreCase(req.getName())) {
            throw new DuplicateResourceException("Category '" + req.getName() + "' already exists");
        }
        Category saved = categoryRepository.save(Category.builder().name(req.getName()).build());
        return toResponse(saved);
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category category = getOrThrow(id);
        category.setName(req.getName());
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = getOrThrow(id);
        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAll() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    private Category getOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
