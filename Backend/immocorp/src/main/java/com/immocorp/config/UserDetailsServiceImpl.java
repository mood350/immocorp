// UserDetailsServiceImpl.java
package com.immocorp.config;

import com.immocorp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        return utilisateurRepository
                .findByEmailOrTelephone(identifier, identifier)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utilisateur non trouvé : " + identifier));
    }
}