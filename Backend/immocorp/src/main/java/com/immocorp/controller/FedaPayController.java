package com.immocorp.controller;

import com.immocorp.dto.FedaPayRequest;
import com.immocorp.dto.FedaPayResponse;
import com.immocorp.service.FedaPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/paiements/fedapay")
@RequiredArgsConstructor
public class FedaPayController {

    private final FedaPayService fedaPayService;

    // ✅ Initier un paiement depuis Flutter
    @PostMapping("/initier")
    public ResponseEntity<FedaPayResponse> initierPaiement(
            @RequestBody FedaPayRequest request) {
        return ResponseEntity.ok(fedaPayService.initierPaiement(request));
    }

    @PostMapping("/callback")
    public ResponseEntity<String> callback(
            @RequestBody Map<String, Object> payload) {
        log.info("📩 Callback reçu : {}", payload);

        String transactionId = payload.get("id").toString();
        String status = payload.get("status").toString();
        Long bailId = Long.parseLong(payload.get("bail_id").toString());
        String moisConcerne = payload.get("mois_concerne").toString();

        fedaPayService.traiterCallback(transactionId, status, bailId, moisConcerne);
        return ResponseEntity.ok("OK");
    }

    // ✅ Vérifier le statut d'une transaction
    @GetMapping("/statut/{transactionId}")
    public ResponseEntity<Map<String, String>> verifierStatut(
            @PathVariable String transactionId) {
        return ResponseEntity.ok(Map.of(
                "transactionId", transactionId,
                "message", "Vérification en cours"
        ));
    }
}