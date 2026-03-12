package com.immocorp.service;

import com.immocorp.dto.AlerteDTO;
import com.immocorp.entity.*;
import com.immocorp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AlerteService {

    private final AlerteRepository  alerteRepository;
    private final BailRepository    bailRepository;
    private final EmailService      emailService;
    private final TwilioSmsService  twilioSmsService;

    // =========================================================
    // JOB 1 — Vérification des retards (toutes les 15 minutes)
    // =========================================================
    @Scheduled(cron = "0 0/15 * * * *")
    public void verifierRetardsPaiements() {
        log.info("🔔 Vérification des retards — {}", LocalDateTime.now());

        List<Bail> bauxActifs = bailRepository.findByStatut(StatutBail.ACTIF);
        LocalDate aujourdhui = LocalDate.now();
        int compteur = 0;

        for (Bail bail : bauxActifs) {

            // ===== RETARD DE PAIEMENT =====
            if (aujourdhui.getDayOfMonth() > bail.getJourEcheance() + 3) {
                boolean dejaAlertee = alerteRepository
                        .existsByBailIdAndTypeAndEstLueFalse(
                                bail.getId(), TypeAlerte.RETARD_PAIEMENT);

                if (!dejaAlertee) {
                    int joursRetard = aujourdhui.getDayOfMonth() - bail.getJourEcheance();

                    creerAlerte(bail, TypeAlerte.RETARD_PAIEMENT,
                            "⚠️ Retard de paiement : "
                                    + bail.getLocataire().getNom()
                                    + " " + bail.getLocataire().getPrenom()
                                    + " — " + bail.getPropriete().getAdresse());

                    twilioSmsService.notifierRetardPaiement(
                            bail.getLocataire().getNom() + " " + bail.getLocataire().getPrenom(),
                            bail.getPropriete().getAdresse(),
                            bail.getMontantLoyer(),
                            joursRetard
                    );
                    compteur++;
                }
            }

            // ===== BAIL BIENTÔT EXPIRÉ =====
            if (bail.getDateFin() != null
                    && bail.getDateFin().isBefore(aujourdhui.plusDays(30))
                    && bail.getDateFin().isAfter(aujourdhui)) {

                boolean dejaAlertee = alerteRepository
                        .existsByBailIdAndTypeAndEstLueFalse(
                                bail.getId(), TypeAlerte.FIN_BAIL_PROCHE);

                if (!dejaAlertee) {
                    long joursRestants = aujourdhui.until(
                            bail.getDateFin(), ChronoUnit.DAYS);

                    creerAlerte(bail, TypeAlerte.FIN_BAIL_PROCHE,
                            "📅 Bail expirant le " + bail.getDateFin()
                                    + " — " + bail.getLocataire().getNom()
                                    + " (" + bail.getPropriete().getAdresse() + ")");

                    twilioSmsService.notifierBailExpirant(
                            bail.getLocataire().getNom() + " " + bail.getLocataire().getPrenom(),
                            bail.getPropriete().getAdresse(),
                            bail.getDateFin().toString(),
                            (int) joursRestants
                    );
                    compteur++;
                }
            }
        }

        log.info("✅ {} nouvelle(s) alerte(s) créée(s)", compteur);
    }

    // =========================================================
    // JOB 2 — Renvoi email toutes les 5h (sauf PAIEMENT_RECU)
    // =========================================================
    @Scheduled(cron = "0 0 0/5 * * *") // 0h, 5h, 10h, 15h, 20h
    public void renvoyerEmailsAlertesActives() {
        log.info("📧 Renvoi périodique des alertes — {}", LocalDateTime.now());

        // Reset du flag pour permettre le renvoi
        alerteRepository.resetEmailEnvoyePourRenvoi();

        List<Alerte> alertes = alerteRepository.findAllPourRenvoi();
        int compteur = 0;

        for (Alerte alerte : alertes) {
            if (!alerte.isEmailEnvoye()) {
                try {
                    Utilisateur proprietaire = alerte.getProprietaire();
                    emailService.envoyerAlerteEmail(
                            proprietaire.getEmail(),
                            proprietaire.getPrenom() + " " + proprietaire.getNom(),
                            alerte.getType().name(),
                            alerte.getMessage()
                    );
                    alerte.setEmailEnvoye(true);
                    alerteRepository.save(alerte);
                    compteur++;
                    log.info("📧 Email renvoyé — alerte #{} type {}",
                            alerte.getId(), alerte.getType());
                } catch (Exception e) {
                    log.error("❌ Échec renvoi email alerte #{} : {}",
                            alerte.getId(), e.getMessage());
                }
            }
        }

        log.info("✅ {} email(s) renvoyé(s)", compteur);
    }

    // =========================================================
    // MÉTHODES PUBLIQUES
    // =========================================================

    public List<AlerteDTO> listerParProprietaire(Long proprietaireId) {
        return alerteRepository
                .findByProprietaireIdOrderByDateAlerteDesc(proprietaireId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AlerteDTO> listerNonLues(Long proprietaireId) {
        return alerteRepository
                .findByProprietaireIdAndEstLueFalse(proprietaireId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AlerteDTO> listerToutes() {
        return alerteRepository
                .findAllByOrderByDateAlerteDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long compterNonLues(Long proprietaireId) {
        return alerteRepository.countByProprietaireIdAndEstLueFalse(proprietaireId);
    }

    public void marquerCommeLue(Long alerteId) {
        Alerte alerte = alerteRepository.findById(alerteId)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée : " + alerteId));
        alerte.setEstLue(true);
        alerteRepository.save(alerte);
        log.info("✅ Alerte #{} marquée comme lue", alerteId);
    }

    public void supprimerAlerteRetard(Long bailId) {
        alerteRepository.deleteByBailIdAndType(bailId, TypeAlerte.RETARD_PAIEMENT);
        log.info("✅ Alerte retard supprimée — bail #{}", bailId);
    }

    public AlerteDTO creerAlerteManuelle(Long bailId, TypeAlerte type, String message) {
        Bail bail = bailRepository.findByIdWithRelations(bailId)
                .orElseThrow(() -> new RuntimeException("Bail non trouvé : " + bailId));
        Alerte alerte = creerAlerte(bail, type, message);
        return toDTO(alerte);
    }

    // =========================================================
    // MÉTHODE PRIVÉE — création + envoi email immédiat
    // =========================================================
    private Alerte creerAlerte(Bail bail, TypeAlerte type, String message) {
        Alerte alerte = Alerte.builder()
                .type(type)
                .message(message)
                .dateAlerte(LocalDateTime.now())
                .estLue(false)
                .emailEnvoye(false)
                .proprietaire(bail.getPropriete().getProprietaire())
                .bail(bail)
                .build();

        Alerte saved = alerteRepository.save(alerte);

        // Envoi email immédiat à la création
        try {
            Utilisateur proprietaire = bail.getPropriete().getProprietaire();
            emailService.envoyerAlerteEmail(
                    proprietaire.getEmail(),
                    proprietaire.getPrenom() + " " + proprietaire.getNom(),
                    type.name(),
                    message
            );
            saved.setEmailEnvoye(true);
            alerteRepository.save(saved);
            log.info("📧 Email envoyé — alerte #{} type {}", saved.getId(), type);
        } catch (Exception e) {
            log.error("❌ Échec envoi email alerte #{} : {}", saved.getId(), e.getMessage());
            // Ne pas bloquer même si l'email échoue
        }

        return saved;
    }

    // =========================================================
    // CONVERSION Alerte → AlerteDTO
    // =========================================================
    private AlerteDTO toDTO(Alerte a) {
        return AlerteDTO.builder()
                .id(a.getId())
                .type(a.getType())
                .message(a.getMessage())
                .dateAlerte(a.getDateAlerte())
                .estLue(a.isEstLue())
                .emailEnvoye(a.isEmailEnvoye())
                .bailId(a.getBail() != null
                        ? a.getBail().getId()
                        : null)
                .proprietaireId(a.getProprietaire() != null
                        ? a.getProprietaire().getId()
                        : null)
                .proprietaireNom(a.getProprietaire() != null
                        ? a.getProprietaire().getPrenom() + " " + a.getProprietaire().getNom()
                        : null)
                .build();
    }
}