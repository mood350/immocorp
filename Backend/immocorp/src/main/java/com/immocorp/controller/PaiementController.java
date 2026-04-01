package com.immocorp.controller;

import com.immocorp.dto.PaiementDTO;
import com.immocorp.dto.PaiementRequest;
import com.immocorp.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;
    private final QuittanceService quittanceService;

    @PostMapping
    public ResponseEntity<PaiementDTO> enregistrer(@RequestBody PaiementRequest request) {
        return ResponseEntity.ok(paiementService.enregistrer(request));
    }

    @GetMapping("/bail/{bailId}")
    public ResponseEntity<List<PaiementDTO>> listerParBail(@PathVariable Long bailId) {
        return ResponseEntity.ok(paiementService.listerParBail(bailId));
    }

    @GetMapping("/quittances/{quittanceId}/pdf")
    public ResponseEntity<byte[]> telechargerQuittance(@PathVariable Long quittanceId) throws IOException {
        byte[] pdf = quittanceService.telecharger(quittanceId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=quittance.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}