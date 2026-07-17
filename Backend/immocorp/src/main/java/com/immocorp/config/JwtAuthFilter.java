package com.immocorp.config;

import io.jsonwebtoken.ExpiredJwtException;
<<<<<<< HEAD
=======
import io.jsonwebtoken.JwtException;
>>>>>>> 676aa67226cf564126769b279dfdd43d869195a8
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
<<<<<<< HEAD
=======
import org.springframework.security.core.userdetails.UsernameNotFoundException;
>>>>>>> 676aa67226cf564126769b279dfdd43d869195a8
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
<<<<<<< HEAD
        final String jwt;
        final String userEmail;
=======
>>>>>>> 676aa67226cf564126769b279dfdd43d869195a8

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

<<<<<<< HEAD
        jwt = authHeader.substring(7);

        try {
            userEmail = jwtService.extractUsername(jwt);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
=======
        final String jwt = authHeader.substring(7);

        try {
            String identifier = jwtService.extractUsername(jwt);
            if (identifier != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(identifier);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
>>>>>>> 676aa67226cf564126769b279dfdd43d869195a8
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException e) {
<<<<<<< HEAD
            // On laisse passer la requête sans authentification.
            // Spring Security renverra un 403/401 si la ressource est protégée.
            logger.info("JWT expiré détecté");
=======
            logger.info("JWT expiré — " + e.getMessage());
        } catch (UsernameNotFoundException e) {
            // JWT valide mais utilisateur supprimé → on ignore, Spring renvoie 401
            logger.warn("JWT valide mais utilisateur introuvable : " + e.getMessage());
        } catch (JwtException e) {
            // JWT malformé, signature invalide, etc.
            logger.warn("JWT invalide : " + e.getMessage());
        } catch (Exception e) {
            logger.error("Erreur filtre JWT : " + e.getMessage());
>>>>>>> 676aa67226cf564126769b279dfdd43d869195a8
        }

        filterChain.doFilter(request, response);
    }
}