package com.cakeshop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subcategory", uniqueConstraints = @UniqueConstraint(columnNames = {"category_id", "name"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subcategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "subcategory", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Product> products = new ArrayList<>();
}
