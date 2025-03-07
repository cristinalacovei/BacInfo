package e_learning_app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class PasswordResetToken extends BaseEntity {
    // Tokenul generat
    @Column(nullable = false, unique = true)
    private String token;

    // Asumăm că fiecare token este asociat unui User (userId)
    @Column(nullable = false)
    private UUID userId;

    // Data și ora expirării tokenului
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // Constructor cu argumente (fără id, deoarece acesta este generat în BaseEntity)
    public PasswordResetToken(String token, UUID userId, LocalDateTime expiryDate) {
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
    }

    // Metodă utilitară pentru verificarea expirării tokenului
    public boolean isExpired() {
        return expiryDate.isBefore(LocalDateTime.now());
    }
}