package com.immocorp.service;

import com.immocorp.dto.PaiementDTO;
import com.immocorp.dto.PaiementRequest;
import com.immocorp.entity.*;
import com.immocorp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final BailRepository bailRepository;
    private final QuittanceService quittanceService;
    private final AlerteService alerteService;
    private final TwilioSmsService twilioSmsService; // ✅ Twilio

    @Transactional
    public PaiementDTO enregistrer(PaiementRequest request) {
        Bail bail = bailRepository.findById(request.getBailId())
                .orElseThrow(() -> new RuntimeException("Bail non trouvé"));

        if (paiementRepository.existsByBailIdAndMoisConcerne(
                bail.getId(), request.getMoisConcerne())) {
            throw new RuntimeException("Paiement déjà enregistré pour ce mois");
        }

        Paiement paiement = Paiement.builder()
                .bail(bail)
                .datePaiement(request.getDatePaiement())
                .montant(request.getMontant())
                .moisConcerne(request.getMoisConcerne())
                .moyenPaiement(MoyenPaiement.valueOf(request.getMoyenPaiement()))
                .referencePaiement(request.getReferencePaiement())
                .build();

        paiement = paiementRepository.save(paiement);

        // Générer la quittance automatiquement
        Quittance quittance = quittanceService.generer(paiement);

        // Supprimer alerte de retard si elle existe
        alerteService.supprimerAlerteRetard(bail.getId());

        String nomLocataire = bail.getLocataire().getNom()
                + " " + bail.getLocataire().getPrenom();

        // ✅ SMS confirmation paiement
        twilioSmsService.notifierPaiementRecu(
                nomLocataire,
                bail.getPropriete().getAdresse(),
                paiement.getMontant(),
                paiement.getMoisConcerne()
        );

        // ✅ SMS quittance générée
        twilioSmsService.notifierQuittanceGeneree(
                nomLocataire,
                paiement.getMoisConcerne(),
                quittance.getId()
        );

        return toDTO(paiement, quittance.getId());
    }

    public List<PaiementDTO> listerParBail(Long bailId) {
        return paiementRepository.findByBailId(bailId)
                .stream()
                .map(p -> toDTO(p,
                        p.getQuittance() != null ? p.getQuittance().getId() : null))
                .collect(Collectors.toList());
    }

    private PaiementDTO toDTO(Paiement p, Long quittanceId) {
        PaiementDTO dto = new PaiementDTO();
        dto.setId(p.getId());
        dto.setDatePaiement(p.getDatePaiement());
        dto.setMontant(p.getMontant());
        dto.setMoisConcerne(p.getMoisConcerne());
        dto.setMoyenPaiement(p.getMoyenPaiement().name());
        dto.setReferencePaiement(p.getReferencePaiement());
        dto.setBailId(p.getBail().getId());
        dto.setQuittanceId(quittanceId);
        return dto;
    }
}