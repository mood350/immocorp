// LocataireDTO.java
package com.immocorp.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class LocataireDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String pieceIdentite;
    private LocalDate dateEntree;
    private LocalDate dateSortie;
}