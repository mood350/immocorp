package com.immocorp.repository;

import com.immocorp.entity.Role;
import com.immocorp.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    long countByActifTrue();
    long countByRole(Role role);
    boolean existsByEmail(String email);
}