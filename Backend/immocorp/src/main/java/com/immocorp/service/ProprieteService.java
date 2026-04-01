// ProprieteService.java
package com.immocorp.service;

import com.immocorp.dto.ProprieteDTO;
import com.immocorp.entity.*;
import com.immocorp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProprieteService {

    private final ProprieteRepository proprieteRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ProprieteDTO creer(ProprieteDTO dto, Long proprietaireId) {
        Utilisateur proprietaire = utilisateurRepository.findById(proprietaireId)
                .orElseThrow(() -> new RuntimeException("Propriétaire non trouvé"));

        Propriete propriete = Propriete.builder()
                .type(dto.getType())
                .adresse(dto.getAdresse())
                .ville(dto.getVille())
                .superficie(dto.getSuperficie())
                .loyer(dto.getLoyer())
                .statut(StatutPropriete.DISPONIBLE)
                .proprietaire(proprietaire)
                .build();

        return toDTO(proprieteRepository.save(propriete));
    }

    public List<ProprieteDTO> listerParProprietaire(Long proprietaireId) {
        return proprieteRepository.findByProprietaireId(proprietaireId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProprieteDTO modifier(Long id, ProprieteDTO dto, Long proprietaireId) {
        Propriete propriete = proprieteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Propriété non trouvée"));

        if (!propriete.getProprietaire().getId().equals(proprietaireId)) {
            throw new RuntimeException("Accès non autorisé");
        }

        propriete.setType(dto.getType());
        propriete.setAdresse(dto.getAdresse());
        propriete.setVille(dto.getVille());
        propriete.setSuperficie(dto.getSuperficie());
        propriete.setLoyer(dto.getLoyer());

        return toDTO(proprieteRepository.save(propriete));
    }

    public void supprimer(Long id, Long proprietaireId) {
        Propriete p = proprieteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Propriété non trouvée"));
        if (!p.getProprietaire().getId().equals(proprietaireId))
            throw new RuntimeException("Accès non autorisé");
        proprieteRepository.delete(p);
    }

    private ProprieteDTO toDTO(Propriete p) {
        ProprieteDTO dto = new ProprieteDTO();
        dto.setId(p.getId());
        dto.setType(p.getType());
        dto.setAdresse(p.getAdresse());
        dto.setVille(p.getVille());
        dto.setSuperficie(p.getSuperficie());
        dto.setLoyer(p.getLoyer());
        dto.setStatut(p.getStatut().name());
        return dto;
    }
}