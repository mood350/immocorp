package com.immocorp.service;

import com.immocorp.dto.BailDTO;
import com.immocorp.entity.*;
import com.immocorp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BailService {

    private final BailRepository bailRepository;
    private final ProprieteRepository proprieteRepository;
    private final LocataireRepository locataireRepository;

    public BailDTO creer(BailDTO dto) {
        Propriete propriete = proprieteRepository.findById(dto.getProprieteId())
                .orElseThrow(() -> new RuntimeException("Propriété non trouvée : " + dto.getProprieteId()));

        if (propriete.getStatut() == StatutPropriete.OCCUPEE) {
            throw new RuntimeException("Cette propriété est déjà occupée");
        }

        Locataire locataire = locataireRepository.findById(dto.getLocataireId())
                .orElseThrow(() -> new RuntimeException("Locataire non trouvé : " + dto.getLocataireId()));

        propriete.setStatut(StatutPropriete.OCCUPEE);
        proprieteRepository.save(propriete);

        Bail bail = Bail.builder()
                .dateDebut(dto.getDateDebut())
                .dateFin(dto.getDateFin())
                .montantLoyer(dto.getMontantLoyer())
                .jourEcheance(dto.getJourEcheance())
                .statut(StatutBail.ACTIF)
                .propriete(propriete)
                .locataire(locataire)
                .build();

        return toDTO(bailRepository.save(bail));
    }

    public List<BailDTO> listerParProprietaire(Long proprietaireId) {
        return bailRepository.findByProprieteProprietaireId(proprietaireId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BailDTO getById(Long id) {
        return toDTO(bailRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new RuntimeException("Bail non trouvé : " + id)));
    }

    public BailDTO detail(Long id) {
        return getById(id);
    }

    public BailDTO modifier(Long id, BailDTO dto) {
        Bail bail = bailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bail non trouvé"));

        bail.setDateDebut(dto.getDateDebut());
        bail.setDateFin(dto.getDateFin());
        bail.setMontantLoyer(dto.getMontantLoyer());
        bail.setJourEcheance(dto.getJourEcheance());
        bail.setStatut(StatutBail.valueOf(dto.getStatut()));

        return toDTO(bailRepository.save(bail));
    }

    public BailDTO supprimer(Long id, Long userId) {
        Bail bail = bailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bail non trouvé : " + id));

        // Remettre la propriété disponible
        Propriete propriete = bail.getPropriete();
        propriete.setStatut(StatutPropriete.DISPONIBLE);
        proprieteRepository.save(propriete);

        // Résilier le bail
        bail.setStatut(StatutBail.RESILIE);
        return toDTO(bailRepository.save(bail));
    }

    public BailDTO toDTO(Bail b) {
        BailDTO dto = new BailDTO();
        dto.setId(b.getId());
        dto.setDateDebut(b.getDateDebut());
        dto.setDateFin(b.getDateFin());
        dto.setMontantLoyer(b.getMontantLoyer());
        dto.setJourEcheance(b.getJourEcheance());
        dto.setStatut(b.getStatut().name());
        dto.setProprieteId(b.getPropriete().getId());
        dto.setLocataireId(b.getLocataire().getId());
        dto.setNomLocataire(b.getLocataire().getNom() + " " + b.getLocataire().getPrenom());
        dto.setAdressePropriete(b.getPropriete().getAdresse());
        return dto;
    }
}