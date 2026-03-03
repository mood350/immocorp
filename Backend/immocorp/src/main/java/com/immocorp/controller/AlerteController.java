package com.immocorp.controller;

import com.immocorp.dto.AlerteManuelleRequest;
import com.immocorp.entity.*;
import com.immocorp.service.AlerteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alertes")
@RequiredArgsConstructor
public class AlerteController {

    private final AlerteService alerteService;

    @GetMapping
    public ResponseEntity<List<Alerte>> lister(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(alerteService.listerParProprietaire(user.getId()));
    }

    @GetMapping("/non-lues")
    public ResponseEntity<List<Alerte>> listerNonLues(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(alerteService.listerNonLues(user.getId()));
    }

    @GetMapping("/non-lues/count")
    public ResponseEntity<Map<String, Long>> compterNonLues(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(Map.of("count", alerteService.compterNonLues(user.getId())));
    }

    @PutMapping("/{id}/lire")
    public ResponseEntity<Void> marquerLue(@PathVariable Long id) {
        alerteService.marquerCommeLue(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/manuel")
    public ResponseEntity<?> creerManuelle(@RequestBody AlerteManuelleRequest request) {
        try {
            TypeAlerte type = TypeAlerte.valueOf(request.getType().toUpperCase().trim());
            Alerte alerte = alerteService.creerAlerteManuelle(
                    request.getBailId(),
                    type,
                    request.getMessage()
            );
            return ResponseEntity.ok(alerte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    "Type invalide. Valeurs acceptées : RETARD_PAIEMENT, FIN_BAIL_PROCHE, LOYER_IMPAYE, ECHEANCE_BAIL"
            );
        }
    }

    @PostMapping("/declencher-verification")
    public ResponseEntity<String> declencherVerification() {
        alerteService.verifierRetardsPaiements();
        return ResponseEntity.ok("✅ Vérification déclenchée ! Consultez GET /api/alertes");
    }
}