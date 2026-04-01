package com.immocorp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String expediteur;

    public void envoyerAlerteEmail(String destinataire, String nom,
                                   String typeAlerte, String message) {
        log.info("📧 Tentative envoi email à {} depuis {}", destinataire, expediteur);
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(expediteur);
            helper.setTo(destinataire);
            helper.setSubject("🔔 ImmoCorp — " + formaterType(typeAlerte));
            helper.setText(construireHtml(nom, typeAlerte, message), true);

            mailSender.send(mimeMessage);
            log.info("✅ Email envoyé avec succès à {}", destinataire);

        } catch (Exception e) {
            log.error("❌ Erreur envoi email à {} : {}", destinataire, e.getMessage());
            log.error("❌ Détail : ", e);
        }
    }

    private String formaterType(String type) {
        return switch (type) {
            case "RETARD_PAIEMENT" -> "Retard de paiement";
            case "FIN_BAIL_PROCHE" -> "Fin de bail proche";
            case "LOYER_IMPAYE"    -> "Loyer impayé";
            case "ECHEANCE_BAIL"   -> "Échéance de bail";
            default -> type;
        };
    }

    private String construireHtml(String nom, String type, String message) {
        return """
            <html>
            <body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;">
              <div style="max-width:600px;margin:auto;background:white;
                          border-radius:10px;padding:30px;
                          box-shadow:0 2px 8px rgba(0,0,0,0.1)">

                <div style="text-align:center;margin-bottom:24px;">
                  <h1 style="color:#1a237e;margin:0;">🏠 ImmoCorp</h1>
                  <p style="color:#666;margin:4px 0;">Gestion locative</p>
                </div>

                <div style="background:#e8eaf6;border-left:4px solid #1a237e;
                            border-radius:0 8px 8px 0;padding:16px;margin-bottom:24px;">
                  <h2 style="color:#1a237e;margin:0 0 8px 0;">🔔 %s</h2>
                </div>

                <p style="color:#333;">Bonjour <strong>%s</strong>,</p>
                <p style="color:#333;">Une alerte a été générée sur votre compte :</p>

                <div style="background:#fff3e0;border-radius:8px;
                            padding:16px;margin:16px 0;border:1px solid #ffcc80;">
                  <p style="margin:0;color:#e65100;font-size:15px;">%s</p>
                </div>

                <p style="color:#666;font-size:13px;">
                  Connectez-vous à ImmoCorp pour gérer cette alerte.
                </p>

                <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
                <p style="color:#aaa;font-size:12px;text-align:center;">
                  © 2026 ImmoCorp — Gestion locative immobilière
                </p>
              </div>
            </body>
            </html>
        """.formatted(formaterType(type), nom, message);
    }
}