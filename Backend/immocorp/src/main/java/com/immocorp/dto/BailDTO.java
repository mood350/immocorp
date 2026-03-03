// BailDTO.java
package com.immocorp.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class BailDTO {
    private Long id;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montantLoyer;
    private Integer jourEcheance;
    private String statut;
    private Long proprieteId;
    private Long locataireId;
    private String nomLocataire;
    private String adressePropriete;
}