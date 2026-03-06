package com.immocorp.service;

import com.immocorp.dto.FedaPayRequest;
import com.immocorp.dto.FedaPayResponse;
import com.immocorp.entity.*;
import com.immocorp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FedaPayService {

    private final BailRepository bailRepository;
    private final PaiementRepository paiementRepository;
    private final QuittanceService quittanceService;
    private final AlerteService alerteService;
    private final EmailService emailService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${fedapay.api.key}")
    private String apiKey;

    @Value("${fedapay.api.url}")
    private String apiUrl;

    @Value("${fedapay.callback.url}")
    private String callbackUrl;

    // ✅ Initier la transaction FedaPay
    public FedaPayResponse initierPaiement(FedaPayRequest request) {
        Bail bail = bailRepository.findByIdWithRelations(request.getBailId())
                .orElseThrow(() -> new RuntimeException("Bail non trouvé"));

        if (paiementRepository.existsByBailIdAndMoisConcerne(
                bail.getId(), request.getMoisConcerne())) {
            throw new RuntimeException("Paiement déjà effectué pour : "
                    + request.getMoisConcerne());
        }

        double montant = bail.getMontantLoyer();
        Locataire locataire = bail.getLocataire();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // Body de la transaction
            Map<String, Object> currency = new HashMap<>();
            currency.put("iso", "XOF");

            Map<String, Object> phoneNumber = new HashMap<>();
            phoneNumber.put("number", request.getTelephone());
            phoneNumber.put("country", "TG");

            Map<String, Object> customer = new HashMap<>();
            customer.put("firstname", locataire.getPrenom());
            customer.put("lastname", locataire.getNom());
            customer.put("email", locataire.getEmail() != null
                    ? locataire.getEmail() : "");
            customer.put("phone_number", phoneNumber);

            Map<String, Object> body = new HashMap<>();
            body.put("description", "Loyer " + request.getMoisConcerne()
                    + " - " + bail.getPropriete().getAdresse());
            body.put("amount", (int) montant);
            body.put("currency", currency);
            body.put("callback_url", callbackUrl);
            body.put("customer", customer);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl + "/transactions", entity, Map.class);

            Map transaction = (Map) response.getBody().get("v1/transaction");
            String transactionId = transaction.get("id").toString();
            String status = transaction.get("status").toString();

            // Générer le lien de paiement
            String paymentUrl = genererLienPaiement(transactionId, headers);

            log.info("✅ Transaction FedaPay créée : {} — status: {}",
                    transactionId, status);

            return FedaPayResponse.builder()
                    .status(status)
                    .transactionId(transactionId)
                    .paymentUrl(paymentUrl)
                    .montant(montant)
                    .moisConcerne(request.getMoisConcerne())
                    .message("Transaction initiée. Ouvrez le lien pour payer.")
                    .build();

        } catch (Exception e) {
            log.error("❌ Erreur FedaPay : {}", e.getMessage());
            throw new RuntimeException("Erreur paiement FedaPay : " + e.getMessage());
        }
    }

    // ✅ Générer le lien de paiement
    private String genererLienPaiement(String transactionId, HttpHeaders headers) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("id", transactionId);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl + "/transactions/" + transactionId + "/token",
                    entity, Map.class);

            String token = response.getBody().get("token").toString();
            return "https://me.fedapay.com/" + token;

        } catch (Exception e) {
            log.error("❌ Erreur token FedaPay : {}", e.getMessage());
            return "";
        }
    }

    // ✅ Callback après paiement
    @Transactional
    public void traiterCallback(String transactionId, String status,
                                Long bailId, String moisConcerne) {
        log.info("📩 Callback FedaPay — transaction: {} status: {}",
                transactionId, status);

        if (!"approved".equals(status)) {
            log.warn("⚠️ Paiement non approuvé : {}", status);
            return;
        }

        Bail bail = bailRepository.findByIdWithRelations(bailId)
                .orElseThrow(() -> new RuntimeException("Bail non trouvé"));

        Paiement paiement = Paiement.builder()
                .bail(bail)
                .datePaiement(LocalDate.now())
                .montant(bail.getMontantLoyer())
                .moisConcerne(moisConcerne)
                .moyenPaiement(MoyenPaiement.MOBILE_MONEY)
                .referencePaiement("FEDAPAY-" + transactionId)
                .build();

        paiement = paiementRepository.save(paiement);
        quittanceService.generer(paiement);
        alerteService.supprimerAlerteRetard(bailId);

        Utilisateur proprietaire = bail.getPropriete().getProprietaire();
        emailService.envoyerAlerteEmail(
                proprietaire.getEmail(),
                proprietaire.getPrenom() + " " + proprietaire.getNom(),
                "RETARD_PAIEMENT",
                "✅ Paiement reçu de " + bail.getLocataire().getNom()
                        + " pour " + moisConcerne
                        + " — " + bail.getMontantLoyer() + " FCFA"
        );

        log.info("✅ Paiement enregistré — bail: {} mois: {}", bailId, moisConcerne);
    }
}