// QuittanceRepository.java
package com.immocorp.repository;

import com.immocorp.entity.Quittance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuittanceRepository extends JpaRepository<Quittance, Long> {

    // Toutes les quittances d'un bail
    List<Quittance> findByPaiementBailId(Long bailId);

    // Toutes les quittances d'un propriétaire
    @Query("""
        SELECT q FROM Quittance q
        WHERE q.paiement.bail.propriete.proprietaire.id = :proprietaireId
        ORDER BY q.dateEmission DESC
    """)
    List<Quittance> findByProprietaireId(@Param("proprietaireId") Long proprietaireId);

    // Quittances d'un locataire spécifique
    @Query("""
        SELECT q FROM Quittance q
        WHERE q.paiement.bail.locataire.id = :locataireId
        ORDER BY q.dateEmission DESC
    """)
    List<Quittance> findByLocataireId(@Param("locataireId") Long locataireId);

    // Quittance liée à un paiement précis
    Optional<Quittance> findByPaiementId(Long paiementId);

    // Quittances par mois concerné
    List<Quittance> findByMoisConcerne(String moisConcerne);

    // Vérifier si une quittance existe déjà pour ce bail + mois
    @Query("""
        SELECT COUNT(q) > 0 FROM Quittance q
        WHERE q.paiement.bail.id = :bailId
        AND q.moisConcerne = :mois
    """)
    boolean existsByBailIdAndMois(@Param("bailId") Long bailId, @Param("mois") String mois);

    // Dernière quittance d'un bail
    @Query("""
        SELECT q FROM Quittance q
        WHERE q.paiement.bail.id = :bailId
        ORDER BY q.dateEmission DESC
        LIMIT 1
    """)
    Optional<Quittance> findDerniereByBailId(@Param("bailId") Long bailId);
}