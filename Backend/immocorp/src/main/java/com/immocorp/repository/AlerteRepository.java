package com.immocorp.repository;

import com.immocorp.entity.Alerte;
import com.immocorp.entity.TypeAlerte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AlerteRepository extends JpaRepository<Alerte, Long> {

    // Lister par propriétaire — toutes les alertes, les plus récentes en premier
    List<Alerte> findByProprietaireIdOrderByDateAlerteDesc(Long proprietaireId);

    // Non lues
    List<Alerte> findByProprietaireIdAndEstLueFalse(Long proprietaireId);
    long countByProprietaireIdAndEstLueFalse(Long proprietaireId);

    // Vérifications doublons
    boolean existsByBailIdAndTypeAndEstLueFalse(Long bailId, TypeAlerte type);

    // Suppression
    void deleteByBailIdAndType(Long bailId, TypeAlerte type);

    // ✅ Toutes les alertes pour renvoi email (sauf PAIEMENT_RECU)
    @Query("SELECT a FROM Alerte a WHERE a.type != 'PAIEMENT_RECU' ORDER BY a.dateAlerte DESC")
    List<Alerte> findAllPourRenvoi();

    // ✅ Toutes les alertes toutes confondues (admin)
    List<Alerte> findAllByOrderByDateAlerteDesc();

    // ✅ Reset emailEnvoye pour renvoi périodique (sauf PAIEMENT_RECU)
    @Modifying
    @Query("UPDATE Alerte a SET a.emailEnvoye = false WHERE a.type != 'PAIEMENT_RECU'")
    void resetEmailEnvoyePourRenvoi();
}