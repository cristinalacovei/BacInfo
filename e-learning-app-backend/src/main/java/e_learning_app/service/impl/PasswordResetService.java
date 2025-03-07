package e_learning_app.service.impl;

import e_learning_app.model.PasswordResetToken;
import e_learning_app.model.User;
import e_learning_app.repository.PasswordResetTokenRepository;
import e_learning_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    // Expirarea tokenului, de ex.: 30 minute
    private static final long EXPIRATION_MINUTES = 30L;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository; // presupunând că ai un repository pentru entitatea User

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Metoda care generează tokenul și creează o intrare în DB
    public PasswordResetToken createPasswordResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmailAddress(email);
        if(userOpt.isEmpty()){
            return null; // sau poți arunca o excepție, în funcție de comportamentul dorit
        }
        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);
        PasswordResetToken resetToken = new PasswordResetToken(token, user.getId(), expiryDate);
        tokenRepository.save(resetToken);
        return resetToken;
    }

    // Metoda care actualizează parola, după validarea tokenului
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if(tokenOpt.isEmpty()){
            return false;
        }
        PasswordResetToken resetToken = tokenOpt.get();
        if(resetToken.isExpired()){
            return false;
        }
        // Preluăm utilizatorul
        Optional<User> userOpt = userRepository.findById(resetToken.getUserId());
        if(userOpt.isEmpty()){
            return false;
        }
        User user = userOpt.get();
        // Actualizare parolă (asigură-te că o encodezi)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        // Invalidate token after use
        tokenRepository.delete(resetToken);
        return true;
    }
}