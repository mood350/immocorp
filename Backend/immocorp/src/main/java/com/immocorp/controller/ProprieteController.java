// ProprieteController.java
package com.immocorp.controller;

import com.immocorp.dto.ProprieteDTO;
import com.immocorp.entity.Utilisateur;
import com.immocorp.service.ProprieteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proprietes")
@RequiredArgsConstructor
public class ProprieteController {

    private final ProprieteService proprieteService;

    @GetMapping
    public ResponseEntity<List<ProprieteDTO>> lister(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(proprieteService.listerParProprietaire(user.getId()));
    }

    @PostMapping
    public ResponseEntity<ProprieteDTO> creer(@RequestBody ProprieteDTO dto,
                                              @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(proprieteService.creer(dto, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProprieteDTO> modifier(@PathVariable Long id,
                                                 @RequestBody ProprieteDTO dto,
                                                 @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(proprieteService.modifier(id, dto, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id,
                                          @AuthenticationPrincipal Utilisateur user) {
        proprieteService.supprimer(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}