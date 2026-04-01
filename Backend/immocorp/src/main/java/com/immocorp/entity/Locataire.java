package com.immocorp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "locataires")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Locataire {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String telephone;

    @Column(unique = true)
    private String email;

    private String pieceIdentite;
    private LocalDate dateEntree;
    private LocalDate dateSortie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private Utilisateur proprietaire;
}