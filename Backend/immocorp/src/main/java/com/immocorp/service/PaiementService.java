// PaiementService.java
package com.immocorp.service;

import com.immocorp.dto.PaiementRequest;
import com.immocorp.entity.*;
import com.immocorp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final BailRepository bailRepository;
    private final QuittanceService quittanceService;
    private final AlerteService alerteService;

    @Transactional
    public Paiement enregistrer(PaiementRequest request) {
        Bail bail = bailRepository.findById(request.getBailId())
                .orElseThrow(() -> new RuntimeException("Bail non trouvé"));

        if (paiementRepository.existsByBailIdAndMoisConcerne(bail.getId(), request.getMoisConcerne())) {
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
        quittanceService.generer(paiement);

        // Supprimer alerte de retard si elle existe
        alerteService.supprimerAlerteRetard(bail.getId());

        return paiement;
    }

    public List<Paiement> listerParBail(Long bailId) {
        return paiementRepository.findByBailId(bailId);
    }
}