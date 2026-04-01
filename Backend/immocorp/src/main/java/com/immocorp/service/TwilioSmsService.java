package com.immocorp.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TwilioSmsService {

    @Value("${twilio.phone.number}")
    private String twilioNumber;

    @Value("${twilio.phone.destinataire}")
    private String destinataire;

    /**
     * Méthode principale d'envoi de SMS
     */
    public void envoyerSms(String message) {
        try {
            Message sms = Message.creator(
                    new PhoneNumber(destinataire),
                    new PhoneNumber(twilioNumber),
                    message
            ).create();

            log.info("✅ SMS envoyé - SID: {}, Statut: {}",
                    sms.getSid(), sms.getStatus());

        } catch (Exception e) {
            log.error("❌ Erreur envoi SMS Twilio : {}", e.getMessage());
            // Ne pas bloquer le flux principal
        }
    }

    // ===== MESSAGES PRÉDÉFINIS =====

    public void notifierPaiementRecu(String nomLocataire,
                                     String adresse,
                                     Double montant,
                                     String mois) {
        String message = String.format(
                "[ImmoCorp] Paiement recu\n" +
                        "Locataire: %s\n" +
                        "Bien: %s\n" +
                        "Montant: %.0f FCFA\n" +
                        "Mois: %s\n" +
                        "Quittance generee automatiquement.",
                nomLocataire, adresse, montant, mois
        );
        envoyerSms(message);
    }

    public void notifierQuittanceGeneree(String nomLocataire,
                                         String mois,
                                         Long quittanceId) {
        String message = String.format(
                "[ImmoCorp] Quittance generee\n" +
                        "Locataire: %s\n" +
                        "Mois: %s\n" +
                        "ID: #%d\n" +
                        "Telechargeable depuis ImmoCorp.",
                nomLocataire, mois, quittanceId
        );
        envoyerSms(message);
    }

    public void notifierRetardPaiement(String nomLocataire,
                                       String adresse,
                                       Double montant,
                                       int joursRetard) {
        String message = String.format(
                "[ImmoCorp] RETARD DE PAIEMENT\n" +
                        "Locataire: %s\n" +
                        "Bien: %s\n" +
                        "Montant attendu: %.0f FCFA\n" +
                        "Retard: %d jour(s)\n" +
                        "Veuillez contacter votre locataire.",
                nomLocataire, adresse, montant, joursRetard
        );
        envoyerSms(message);
    }

    public void notifierBailExpirant(String nomLocataire,
                                     String adresse,
                                     String dateFin,
                                     int joursRestants) {
        String message = String.format(
                "[ImmoCorp] BAIL BIENTOT EXPIRE\n" +
                        "Locataire: %s\n" +
                        "Bien: %s\n" +
                        "Date de fin: %s\n" +
                        "Jours restants: %d\n" +
                        "Pensez a renouveler ou resilier.",
                nomLocataire, adresse, dateFin, joursRestants
        );
        envoyerSms(message);
    }
}