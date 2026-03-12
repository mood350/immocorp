package com.immocorp.controller;

import com.immocorp.entity.Role;
import com.immocorp.entity.Utilisateur;
import com.immocorp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/utilisateurs")
    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }

    @PutMapping("/utilisateurs/{id}/toggle-actif")
    public Utilisateur toggleActif(@PathVariable Long id) {
        Utilisateur u = utilisateurRepository.findById(id).orElseThrow();
        u.setActif(!u.isActif());
        return utilisateurRepository.save(u);
    }

    @PutMapping("/utilisateurs/{id}/role")
    public Utilisateur changerRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Utilisateur u = utilisateurRepository.findById(id).orElseThrow();
        u.setRole(Role.valueOf(body.get("role")));
        return utilisateurRepository.save(u);
    }

    @DeleteMapping("/utilisateurs/{id}")
    public void supprimer(@PathVariable Long id) {
        utilisateurRepository.deleteById(id);
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return Map.of(
                "totalUtilisateurs", utilisateurRepository.count(),
                "comptesActifs", utilisateurRepository.countByActifTrue(),
                "totalProprietaires", utilisateurRepository.countByRole(Role.PROPRIETAIRE)
        );
    }
}