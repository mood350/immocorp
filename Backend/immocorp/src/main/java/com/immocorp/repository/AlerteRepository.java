// AlerteRepository.java
package com.immocorp.repository;
import com.immocorp.entity.Alerte;
import com.immocorp.entity.TypeAlerte;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlerteRepository extends JpaRepository<Alerte, Long> {
    List<Alerte> findByProprietaireIdOrderByDateAlerteDesc(Long proprietaireId);
    List<Alerte> findByProprietaireIdAndEstLueFalse(Long proprietaireId);
    long countByProprietaireIdAndEstLueFalse(Long proprietaireId);
    boolean existsByBailIdAndTypeAndEstLueFalse(Long bailId, TypeAlerte type);
    void deleteByBailIdAndType(Long bailId, TypeAlerte type);
}