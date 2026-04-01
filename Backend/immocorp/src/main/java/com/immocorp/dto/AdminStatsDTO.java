package com.immocorp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalUtilisateurs;
    private long comptesActifs;
    private long totalProprietaires;
    private long totalAdmins;
}