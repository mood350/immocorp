package com.immocorp.controller;

import com.immocorp.dto.LocataireDTO;
import com.immocorp.entity.Utilisateur;
import com.immocorp.service.LocataireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locataires")
@RequiredArgsConstructor
public class LocataireController {

    private final LocataireService locataireService;

    @GetMapping
    public ResponseEntity<List<LocataireDTO>> lister(@AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(locataireService.listerParProprietaire(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocataireDTO> getById(@PathVariable Long id,
                                                @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(locataireService.getById(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<LocataireDTO> creer(@RequestBody LocataireDTO dto,
                                              @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(locataireService.creer(dto, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocataireDTO> modifier(@PathVariable Long id,
                                                 @RequestBody LocataireDTO dto,
                                                 @AuthenticationPrincipal Utilisateur user) {
        return ResponseEntity.ok(locataireService.modifier(id, dto, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id,
                                          @AuthenticationPrincipal Utilisateur user) {
        locataireService.supprimer(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}