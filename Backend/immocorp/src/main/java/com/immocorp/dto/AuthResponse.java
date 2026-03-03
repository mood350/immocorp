// AuthResponse.java
package com.immocorp.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String nom;
    private String role;
}