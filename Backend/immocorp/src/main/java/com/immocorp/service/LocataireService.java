package com.immocorp.service;

import com.immocorp.dto.LocataireDTO;
import com.immocorp.entity.*;
import com.immocorp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocataireService {

    private final LocataireRepository locataireRepository;
    private final UtilisateurRepository utilisateurRepository;

    public LocataireDTO creer(LocataireDTO dto, Long proprietaireId) {
        Utilisateur proprietaire = utilisateurRepository.findById(proprietaireId)
                .orElseThrow(() -> new RuntimeException("Propriétaire non trouvé"));

        Locataire locataire = Locataire.builder()
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .telephone(dto.getTelephone())
                .email(dto.getEmail())
                .pieceIdentite(dto.getPieceIdentite())
                .dateEntree(dto.getDateEntree())
                .dateSortie(dto.getDateSortie())
                .proprietaire(proprietaire)
                .build();

        return toDTO(locataireRepository.save(locataire));
    }

    public List<LocataireDTO> listerParProprietaire(Long proprietaireId) {
        return locataireRepository.findByProprietaireId(proprietaireId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public LocataireDTO getById(Long id, Long proprietaireId) {
        Locataire locataire = locataireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Locataire non trouvé"));

        if (!locataire.getProprietaire().getId().equals(proprietaireId))
            throw new RuntimeException("Accès non autorisé");

        return toDTO(locataire);
    }

    public LocataireDTO modifier(Long id, LocataireDTO dto, Long proprietaireId) {
        Locataire locataire = locataireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Locataire non trouvé"));

        if (!locataire.getProprietaire().getId().equals(proprietaireId))
            throw new RuntimeException("Accès non autorisé");

        locataire.setNom(dto.getNom());
        locataire.setPrenom(dto.getPrenom());
        locataire.setTelephone(dto.getTelephone());
        locataire.setEmail(dto.getEmail());
        locataire.setPieceIdentite(dto.getPieceIdentite());
        locataire.setDateEntree(dto.getDateEntree());
        locataire.setDateSortie(dto.getDateSortie());

        return toDTO(locataireRepository.save(locataire));
    }

    public void supprimer(Long id, Long proprietaireId) {
        Locataire locataire = locataireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Locataire non trouvé"));

        if (!locataire.getProprietaire().getId().equals(proprietaireId))
            throw new RuntimeException("Accès non autorisé");

        locataireRepository.delete(locataire);
    }

    private LocataireDTO toDTO(Locataire l) {
        LocataireDTO dto = new LocataireDTO();
        dto.setId(l.getId());
        dto.setNom(l.getNom());
        dto.setPrenom(l.getPrenom());
        dto.setTelephone(l.getTelephone());
        dto.setEmail(l.getEmail());
        dto.setPieceIdentite(l.getPieceIdentite());
        dto.setDateEntree(l.getDateEntree());
        dto.setDateSortie(l.getDateSortie());
        return dto;
    }
}