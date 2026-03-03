// QuittanceService.java
package com.immocorp.service;

import com.immocorp.entity.*;
import com.immocorp.repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class QuittanceService {

    private final QuittanceRepository quittanceRepository;

    @Value("${app.upload.quittances-dir}")
    private String quittancesDir;

    public Quittance generer(Paiement paiement) {
        String nomFichier = "quittance_" + paiement.getId() + "_"
                + paiement.getMoisConcerne() + ".pdf";
        String chemin = quittancesDir + nomFichier;

        try {
            Files.createDirectories(Paths.get(quittancesDir));
            genererPDF(paiement, chemin);
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PDF: " + e.getMessage());
        }

        Quittance quittance = Quittance.builder()
                .dateEmission(LocalDate.now())
                .montantPaye(paiement.getMontant())
                .moisConcerne(paiement.getMoisConcerne())
                .cheminFichierPdf(chemin)
                .paiement(paiement)
                .build();

        return quittanceRepository.save(quittance);
    }

    private void genererPDF(Paiement paiement, String chemin) throws Exception {
        Document doc = new Document();
        PdfWriter.getInstance(doc, new FileOutputStream(chemin));
        doc.open();

        Bail bail = paiement.getBail();
        Locataire locataire = bail.getLocataire();
        Propriete propriete = bail.getPropriete();
        Utilisateur proprietaire = propriete.getProprietaire();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 12);
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);

        doc.add(new Paragraph("QUITTANCE DE LOYER", titleFont));
        doc.add(new Paragraph("Mois : " + paiement.getMoisConcerne(), boldFont));
        doc.add(Chunk.NEWLINE);

        doc.add(new Paragraph("PROPRIÉTAIRE", boldFont));
        doc.add(new Paragraph(proprietaire.getNom() + " " + proprietaire.getPrenom(), normalFont));
        doc.add(new Paragraph(proprietaire.getEmail(), normalFont));
        doc.add(Chunk.NEWLINE);

        doc.add(new Paragraph("LOCATAIRE", boldFont));
        doc.add(new Paragraph(locataire.getNom() + " " + locataire.getPrenom(), normalFont));
        doc.add(new Paragraph("Bien loué : " + propriete.getAdresse() + ", " + propriete.getVille(), normalFont));
        doc.add(Chunk.NEWLINE);

        doc.add(new Paragraph("DÉTAILS DU PAIEMENT", boldFont));
        doc.add(new Paragraph("Montant payé : " + paiement.getMontant() + " FCFA", normalFont));
        doc.add(new Paragraph("Date de paiement : "
                + paiement.getDatePaiement().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), normalFont));
        doc.add(new Paragraph("Moyen de paiement : " + paiement.getMoyenPaiement(), normalFont));
        doc.add(Chunk.NEWLINE);

        doc.add(new Paragraph("Le propriétaire certifie avoir reçu la somme mentionnée ci-dessus.", normalFont));

        doc.close();
    }

    public byte[] telecharger(Long quittanceId) throws IOException {
        Quittance q = quittanceRepository.findById(quittanceId)
                .orElseThrow(() -> new RuntimeException("Quittance non trouvée"));
        return Files.readAllBytes(Paths.get(q.getCheminFichierPdf()));
    }
}