package com.immocorp.config;

import com.immocorp.entity.Role;
import com.immocorp.entity.Utilisateur;
import com.immocorp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (utilisateurRepository.findByEmail("admin@immocorp.com").isEmpty()) {
            Utilisateur admin = Utilisateur.builder()
                    .nom("Admin")
                    .prenom("ImmoCorp")
                    .email("admin@immocorp.com")
                    .password(passwordEncoder.encode("Admin@2026"))
                    .telephone("+22890000000")
                    .role(Role.ADMIN)
                    .build();
            utilisateurRepository.save(admin);
            log.info("✅ Compte admin créé : admin@immocorp.com / Admin@2026");
        }
    }
}