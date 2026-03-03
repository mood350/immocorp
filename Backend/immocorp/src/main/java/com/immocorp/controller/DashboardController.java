package com.immocorp.controller;

import com.immocorp.entity.Utilisateur;
import com.immocorp.repository.*;
import com.immocorp.entity.StatutBail;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProprieteRepository proprieteRepository;
    private final LocataireRepository locataireRepository;
    private final BailRepository bailRepository;
    private final PaiementRepository paiementRepository;
    private final AlerteRepository alerteRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal Utilisateur user) {
        Long id = user.getId();

        long totalProprietes = proprieteRepository.findByProprietaireId(id).size();
        long totalLocataires = locataireRepository.findByProprietaireId(id).size();
        long bauxActifs = bailRepository.findByProprieteProprietaireId(id)
                .stream().filter(b -> b.getStatut() == StatutBail.ACTIF).count();
        Double totalLoyers = paiementRepository.sumMontantByProprietaireId(id);
        long alertesNonLues = alerteRepository.countByProprietaireIdAndEstLueFalse(id);

        return ResponseEntity.ok(Map.of(
                "totalProprietes", totalProprietes,
                "totalLocataires", totalLocataires,
                "bauxActifs", bauxActifs,
                "totalLoyersPercus", totalLoyers != null ? totalLoyers : 0.0,
                "alertesNonLues", alertesNonLues
        ));
    }
}