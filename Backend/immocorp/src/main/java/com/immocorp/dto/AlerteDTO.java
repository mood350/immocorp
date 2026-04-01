package com.immocorp.dto;

import com.immocorp.entity.TypeAlerte;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlerteDTO {
    private Long          id;
    private TypeAlerte    type;
    private String        message;
    private LocalDateTime dateAlerte;
    private boolean       estLue;
    private boolean       emailEnvoye;
    private Long          bailId;
    private Long          proprietaireId;
    private String        proprietaireNom;
}