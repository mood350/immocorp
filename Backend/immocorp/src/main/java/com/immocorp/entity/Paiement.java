package com.immocorp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "paiements")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Paiement {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate datePaiement;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false)
    private String moisConcerne; // ex: "2024-03"

    @Enumerated(EnumType.STRING)
    private MoyenPaiement moyenPaiement; // ESPECES, VIREMENT, MOBILE_MONEY

    private String referencePaiement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bail_id", nullable = false)
    private Bail bail;

    @OneToOne(mappedBy = "paiement", cascade = CascadeType.ALL)
    private Quittance quittance;
}