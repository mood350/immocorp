// FedaPayRequest.java
package com.immocorp.dto;

import lombok.Data;

@Data
public class FedaPayRequest {
    private Long bailId;
    private String moisConcerne;
    private String moyenPaiement; // MOBILE_MONEY, CARTE
    private String telephone;     // pour Mobile Money
    private String description;
}