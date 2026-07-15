package com.cakeshop.service;

import com.cakeshop.dto.category.SubcategoryRequest;
import com.cakeshop.dto.category.SubcategoryResponse;
import com.cakeshop.entity.Category;
import com.cakeshop.entity.Subcategory;
import com.cakeshop.exception.DuplicateResourceException;
import com.cakeshop.exception.ResourceNotFoundException;
import com.cakeshop.repository.CategoryRepository;
import com.cakeshop.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public SubcategoryResponse create(SubcategoryRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + req.getCategoryId()));

        if (subcategoryRepository.existsByCategoryIdAndNameIgnoreCase(category.getId(), req.getName())) {
            throw new DuplicateResourceException("Subcategory '" + req.getName() + "' already exists in this category");
        }

        Subcategory saved = subcategoryRepository.save(
                Subcategory.builder().category(category).name(req.getName()).build());
        return toResponse(saved);
    }

    @Transactional
    public SubcategoryResponse update(Long id, SubcategoryRequest req) {
        Subcategory subcategory = getOrThrow(id);
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + req.getCategoryId()));
        subcategory.setName(req.getName());
        subcategory.setCategory(category);
        return toResponse(subcategoryRepository.save(subcategory));
    }

    @Transactional
    public void delete(Long id) {
        Subcategory subcategory = getOrThrow(id);
        subcategoryRepository.delete(subcategory);
    }

    @Transactional(readOnly = true)
    public List<SubcategoryResponse> listAll() {
        return subcategoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SubcategoryResponse> listByCategory(Long categoryId) {
        return subcategoryRepository.findByCategoryId(categoryId).stream().map(this::toResponse).toList();
    }

    private Subcategory getOrThrow(Long id) {
        return subcategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found with id: " + id));
    }

    private SubcategoryResponse toResponse(Subcategory s) {
        return new SubcategoryResponse(s.getId(), s.getName(), s.getCategory().getId(), s.getCategory().getName());
    }
}
