package e_learning_app.controller;

import e_learning_app.model.PasswordResetToken;
import e_learning_app.service.impl.PasswordResetService;
import e_learning_app.util.EmailService; // presupunem că ai o componentă pentru trimiterea emailului
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {
    private final PasswordResetService passwordResetService;
    private final EmailService emailService;


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if(email == null || email.isEmpty()){
            return ResponseEntity.badRequest().body("Email-ul este necesar");
        }

        PasswordResetToken resetToken = passwordResetService.createPasswordResetToken(email);
        if(resetToken == null){
            return ResponseEntity.ok(Map.of("message", "Dacă email-ul există în sistem, vei primi instrucțiuni."));

        }

        String encodedToken = URLEncoder.encode(resetToken.getToken(), StandardCharsets.UTF_8);
        String frontendUrl = "http://localhost:4200";
        String resetUrl = frontendUrl + "/reset-password?token=" + encodedToken;

        String subject = "Resetare parolă";
        String bodyEmail = "Pentru a-ți reseta parola, te rog accesează link-ul: " + resetUrl;
        emailService.sendEmail(email, subject, bodyEmail);

        return ResponseEntity.ok("Dacă email-ul există în sistem, vei primi instrucțiuni.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if(token == null || token.isEmpty() || newPassword == null || newPassword.isEmpty()){
            return ResponseEntity.badRequest().body("Token și noua parolă sunt necesare");
        }

        boolean result = passwordResetService.resetPassword(token, newPassword);
        if(!result){
            return ResponseEntity.badRequest().body("Token invalid sau expirat");
        }

        return ResponseEntity.ok(Map.of("message", "Parola a fost resetată cu succes!"));

    }

}