// ProprieteDTO.java
package com.immocorp.dto;
import lombok.Data;
@Data
public class ProprieteDTO {
    private Long id;
    private String type;
    private String adresse;
    private String ville;
    private Double superficie;
    private Double loyer;
    private String statut;
}