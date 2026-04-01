package com.immocorp.repository;

import com.immocorp.entity.RefreshToken;
import com.immocorp.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(Utilisateur user);
}