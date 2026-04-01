package com.immocorp.controller;

import com.immocorp.dto.BailDTO;
import com.immocorp.entity.Utilisateur;
import com.immocorp.service.BailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/baux")
@RequiredArgsConstructor
public class BailController {

    private final BailService bailService;

    @GetMapping
    public ResponseEntity<List<BailDTO>> lister(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(bailService.listerParProprietaire(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BailDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bailService.getById(id));
    }

    @PostMapping
    public ResponseEntity<BailDTO> creer(@RequestBody BailDTO dto) {
        return ResponseEntity.ok(bailService.creer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BailDTO> modifier(@PathVariable Long id,
                                            @RequestBody BailDTO dto) {
        return ResponseEntity.ok(bailService.modifier(id, dto));
    }

    @PutMapping("/{id}/resilier")
    public ResponseEntity<BailDTO> resilier(@PathVariable Long id,
                                            @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(bailService.supprimer(id, user.getId()));
    }
}