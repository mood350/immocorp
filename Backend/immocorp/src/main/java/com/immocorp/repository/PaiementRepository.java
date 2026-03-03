// PaiementRepository.java
package com.immocorp.repository;
import com.immocorp.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    List<Paiement> findByBailId(Long bailId);
    boolean existsByBailIdAndMoisConcerne(Long bailId, String moisConcerne);

    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.bail.propriete.proprietaire.id = :proprietaireId")
    Double sumMontantByProprietaireId(Long proprietaireId);
}