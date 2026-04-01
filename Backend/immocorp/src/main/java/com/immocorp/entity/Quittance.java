package com.immocorp.entity;

import com.immocorp.entity.Paiement;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "quittances")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Quittance {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dateEmission;

    @Column(nullable = false)
    private Double montantPaye;

    @Column(nullable = false)
    private String moisConcerne;

    private String cheminFichierPdf;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paiement_id", nullable = false)
    private Paiement paiement;
}