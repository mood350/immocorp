// ProprieteRepository.java
package com.immocorp.repository;
import com.immocorp.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProprieteRepository extends JpaRepository<Propriete, Long> {
    List<Propriete> findByProprietaireId(Long proprietaireId);
    List<Propriete> findByProprietaireIdAndStatut(Long proprietaireId, StatutPropriete statut);
}