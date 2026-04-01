package com.immocorp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alertes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alerte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAlerte type;

    @Column(nullable = false)
    private String message;

    private LocalDateTime dateAlerte;

    @Builder.Default // ✅ Ajouter cette annotation
    private boolean estLue = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id")
    private Utilisateur proprietaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bail_id")
    private Bail bail;

    @Builder.Default
    @Column(nullable = false)
    private boolean emailEnvoye = false;
}