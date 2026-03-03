package com.immocorp.service;

import com.immocorp.entity.*;
import com.immocorp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AlerteService {

    private final AlerteRepository alerteRepository;
    private final BailRepository bailRepository;
    private final EmailService emailService; // ✅ AJOUTÉ

    @Scheduled(cron = "0/10 * * * * *")
    public void verifierRetardsPaiements() {
        log.info("🔔 Vérification des retards — {}", LocalDateTime.now());

        List<Bail> bauxActifs = bailRepository.findByStatut(StatutBail.ACTIF);
        LocalDate aujourd_hui = LocalDate.now();
        int compteur = 0;

        for (Bail bail : bauxActifs) {
            if (aujourd_hui.getDayOfMonth() > bail.getJourEcheance() + 3) {
                boolean dejaAlertee = alerteRepository
                        .existsByBailIdAndTypeAndEstLueFalse(bail.getId(), TypeAlerte.RETARD_PAIEMENT);
                if (!dejaAlertee) {
                    creerAlerte(bail, TypeAlerte.RETARD_PAIEMENT,
                            "⚠️ Retard de paiement : " + bail.getLocataire().getNom()
                                    + " " + bail.getLocataire().getPrenom()
                                    + " — " + bail.getPropriete().getAdresse());
                    compteur++;
                }
            }

            if (bail.getDateFin() != null &&
                    bail.getDateFin().isBefore(aujourd_hui.plusDays(30)) &&
                    bail.getDateFin().isAfter(aujourd_hui)) {
                boolean dejaAlertee = alerteRepository
                        .existsByBailIdAndTypeAndEstLueFalse(bail.getId(), TypeAlerte.FIN_BAIL_PROCHE);
                if (!dejaAlertee) {
                    creerAlerte(bail, TypeAlerte.FIN_BAIL_PROCHE,
                            "📅 Bail expirant le " + bail.getDateFin()
                                    + " — " + bail.getLocataire().getNom()
                                    + " (" + bail.getPropriete().getAdresse() + ")");
                    compteur++;
                }
            }
        }
        log.info("✅ {} nouvelle(s) alerte(s) créée(s)", compteur);
    }

    public Alerte creerAlerteManuelle(Long bailId, TypeAlerte type, String message) {
        Bail bail = bailRepository.findByIdWithRelations(bailId)
                .orElseThrow(() -> new RuntimeException("Bail non trouvé : " + bailId));
        return creerAlerte(bail, type, message);
    }

    private Alerte creerAlerte(Bail bail, TypeAlerte type, String message) {
        Alerte alerte = Alerte.builder()
                .type(type)
                .message(message)
                .dateAlerte(LocalDateTime.now())
                .estLue(false)
                .proprietaire(bail.getPropriete().getProprietaire())
                .bail(bail)
                .build();

        Alerte saved = alerteRepository.save(alerte);

        // ✅ AJOUTÉ — Envoi email au propriétaire
        Utilisateur proprietaire = bail.getPropriete().getProprietaire();
        emailService.envoyerAlerteEmail(
                proprietaire.getEmail(),
                proprietaire.getPrenom() + " " + proprietaire.getNom(),
                type.name(),
                message
        );

        return saved;
    }

    public void supprimerAlerteRetard(Long bailId) {
        alerteRepository.deleteByBailIdAndType(bailId, TypeAlerte.RETARD_PAIEMENT);
    }

    public List<Alerte> listerParProprietaire(Long proprietaireId) {
        return alerteRepository.findByProprietaireIdOrderByDateAlerteDesc(proprietaireId);
    }

    public List<Alerte> listerNonLues(Long proprietaireId) {
        return alerteRepository.findByProprietaireIdAndEstLueFalse(proprietaireId);
    }

    public void marquerCommeLue(Long alerteId) {
        Alerte alerte = alerteRepository.findById(alerteId)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée"));
        alerte.setEstLue(true);
        alerteRepository.save(alerte);
    }

    public long compterNonLues(Long proprietaireId) {
        return alerteRepository.countByProprietaireIdAndEstLueFalse(proprietaireId);
    }
}