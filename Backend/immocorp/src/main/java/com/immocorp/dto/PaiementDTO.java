package com.immocorp.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PaiementDTO {
    private Long id;
    private LocalDate datePaiement;
    private Double montant;
    private String moisConcerne;
    private String moyenPaiement;
    private String referencePaiement;
    private Long bailId;
    private Long quittanceId;
}