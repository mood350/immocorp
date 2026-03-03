package com.immocorp.dto;

import lombok.Data;

@Data
public class AlerteManuelleRequest {
    private Long bailId;
    private String type;
    private String message;
}