// LocataireRepository.java
package com.immocorp.repository;
import com.immocorp.entity.Locataire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocataireRepository extends JpaRepository<Locataire, Long> {
    List<Locataire> findByProprietaireId(Long proprietaireId);
}