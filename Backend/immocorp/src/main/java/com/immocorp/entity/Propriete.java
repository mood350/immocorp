package com.immocorp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "proprietes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Propriete {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // APPARTEMENT, MAISON, STUDIO, etc.

    @Column(nullable = false)
    private String adresse;

    private String ville;
    private Double superficie;

    @Column(nullable = false)
    private Double loyer;

    @Enumerated(EnumType.STRING)
    private StatutPropriete statut; // DISPONIBLE, OCCUPEE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private Utilisateur proprietaire;
}