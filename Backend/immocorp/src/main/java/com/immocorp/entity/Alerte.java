package com.immocorp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alertes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Alerte {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAlerte type; // RETARD_PAIEMENT, ECHEANCE_BAIL, etc.

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    private LocalDateTime dateAlerte;

    @Column(nullable = false)
    private boolean estLue = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private Utilisateur proprietaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bail_id")
    private Bail bail;
}