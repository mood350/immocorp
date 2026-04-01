package com.immocorp.service;

import com.immocorp.dto.AdminStatsDTO;
import com.immocorp.dto.RoleRequest;
import com.immocorp.dto.UtilisateurDTO;
import com.immocorp.entity.Role;
import com.immocorp.entity.Utilisateur;
import com.immocorp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;

    public List<UtilisateurDTO> getAll() {
        return utilisateurRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UtilisateurDTO toggleActif(Long id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        u.setActif(!u.isActif());
        return toDTO(utilisateurRepository.save(u));
    }

    public UtilisateurDTO changerRole(Long id, RoleRequest request) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        u.setRole(request.getRole());
        return toDTO(utilisateurRepository.save(u));
    }

    public void supprimer(Long id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (u.getRole() == Role.ADMIN) {
            throw new RuntimeException("Impossible de supprimer un administrateur");
        }
        utilisateurRepository.deleteById(id);
    }

    public AdminStatsDTO getStats() {
        long total = utilisateurRepository.count();
        long actifs = utilisateurRepository.findAll()
                .stream().filter(Utilisateur::isActif).count();
        long proprietaires = utilisateurRepository.countByRole(Role.PROPRIETAIRE);
        long admins = utilisateurRepository.countByRole(Role.ADMIN);

        return AdminStatsDTO.builder()
                .totalUtilisateurs(total)
                .comptesActifs(actifs)
                .totalProprietaires(proprietaires)
                .totalAdmins(admins)
                .build();
    }

    private UtilisateurDTO toDTO(Utilisateur u) {
        return UtilisateurDTO.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .email(u.getEmail())
                .telephone(u.getTelephone())
                .role(u.getRole())
                .actif(u.isActif())
                .build();
    }
}