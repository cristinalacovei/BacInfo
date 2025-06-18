package e_learning_app.controller;

import e_learning_app.dto.CompleteProfileDTO;
import e_learning_app.dto.LoginRequestDTO;
import e_learning_app.dto.UserDTO;
import e_learning_app.mapper.UserMapper;
import e_learning_app.model.User;
import e_learning_app.repository.UserRepository;
import e_learning_app.service.UserService;
import e_learning_app.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    @PostMapping("/token")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            log.info("Attempting authentication for user: {}", loginRequestDTO.username());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.username(),
                            loginRequestDTO.password()
                    )
            );

            log.info("Authentication successful for user: {}", loginRequestDTO.username());
            String jwt = jwtUtil.generateToken(authentication);
            return ResponseEntity.ok(jwt);

        } catch (BadCredentialsException e) {
            log.error("Authentication failed for user: {}", loginRequestDTO.username());
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            log.error("Error during authentication", e);
            return ResponseEntity.status(500).body("Authentication error occurred");
        }
    }

    @PostMapping("/google")
    public ResponseEntity<String> authenticateWithGoogle(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("Token missing");
        }

        return ResponseEntity.ok(token);
    }

    @GetMapping("/email")
    public ResponseEntity<UserDTO> getUserFromToken(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // OAuth2User (Google login)
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            String email = oauthToken.getPrincipal().getAttribute("email");
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        }

        // JWT (custom login)
        if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
            UUID userId = UUID.fromString(jwt.getSubject());
            return userRepository.findById(userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/complete-profile")
    public ResponseEntity<?> completeProfile(@RequestBody CompleteProfileDTO dto) {
        log.info("Profil primit: email={}, username={}, userRole={}",
                dto.getEmail(), dto.getUsername(), dto.getUserRole());
        try {
            User user = userService.getUserByEmail(dto.getEmail());

            boolean isPlaceholderUsername = user.getUsername() != null && user.getUsername().startsWith("temp_");
            boolean isPendingRole = user.getUserRole() != null && user.getUserRole().equalsIgnoreCase("PENDING");


            if (!isPlaceholderUsername && !isPendingRole) {
                return ResponseEntity.badRequest().body("Profilul a fost deja completat.");
            }

            user.setUsername(dto.getUsername());
            user.setUserRole(dto.getUserRole());

            userService.save(user);


            String newJwt = jwtUtil.generateTokenForOAuth2User(user);
            return ResponseEntity.ok(Map.of("token", newJwt));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}



