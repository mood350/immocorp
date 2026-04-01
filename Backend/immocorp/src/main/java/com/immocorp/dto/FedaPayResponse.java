// FedaPayResponse.java
package com.immocorp.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FedaPayResponse {
    private String status;          // pending, approved, declined
    private String transactionId;
    private String paymentUrl;      // URL de paiement à ouvrir dans Flutter
    private Double montant;
    private String moisConcerne;
    private String message;
}