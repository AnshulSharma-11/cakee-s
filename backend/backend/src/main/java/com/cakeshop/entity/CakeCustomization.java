package com.cakeshop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cake_customization")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CakeCustomization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "weight_kg", precision = 4, scale = 2)
    private BigDecimal weightKg;

    @Column(length = 100)
    private String flavor;

    @Column(length = 50)
    private String shape;

    @Column(name = "message_on_cake")
    private String messageOnCake;

    private Integer layers;

    @Column(name = "special_notes", columnDefinition = "TEXT")
    private String specialNotes;
}
