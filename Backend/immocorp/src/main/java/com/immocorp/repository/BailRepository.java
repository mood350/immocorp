package com.immocorp.repository;

import com.immocorp.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BailRepository extends JpaRepository<Bail, Long> {

    // ✅ JOIN FETCH pour charger toutes les relations en une seule requête
    @Query("""
        SELECT b FROM Bail b
        JOIN FETCH b.propriete p
        JOIN FETCH p.proprietaire
        JOIN FETCH b.locataire
        WHERE b.id = :id
    """)
    Optional<Bail> findByIdWithRelations(@Param("id") Long id);

    @Query("""
        SELECT b FROM Bail b
        JOIN FETCH b.propriete p
        JOIN FETCH p.proprietaire
        JOIN FETCH b.locataire
        WHERE p.proprietaire.id = :proprietaireId
    """)
    List<Bail> findByProprieteProprietaireId(@Param("proprietaireId") Long proprietaireId);

    @Query("""
        SELECT b FROM Bail b
        JOIN FETCH b.propriete p
        JOIN FETCH p.proprietaire
        JOIN FETCH b.locataire
        WHERE b.statut = :statut
    """)
    List<Bail> findByStatut(@Param("statut") StatutBail statut);

    Optional<Bail> findByLocataireIdAndStatut(Long locataireId, StatutBail statut);
}