package com.immocorp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "baux")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bail {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dateDebut;

    private LocalDate dateFin;

    @Column(nullable = false)
    private Double montantLoyer;

    @Column(nullable = false)
    private Integer jourEcheance; // ex: 5 = le 5 de chaque mois

    @Enumerated(EnumType.STRING)
    private StatutBail statut; // ACTIF, RESILIE, EXPIRE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propriete_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "proprietaire"})
    private Propriete propriete;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locataire_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Locataire locataire;
}