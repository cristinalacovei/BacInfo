package e_learning_app.service;

import e_learning_app.model.PasswordResetToken;
import e_learning_app.model.User;
import e_learning_app.repository.PasswordResetTokenRepository;
import e_learning_app.repository.UserRepository;
import e_learning_app.service.impl.PasswordResetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PasswordResetServiceTest {

    private PasswordResetTokenRepository tokenRepository;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private PasswordResetService passwordResetService;

    @BeforeEach
    public void setUp() {
        tokenRepository = mock(PasswordResetTokenRepository.class);
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        passwordResetService = new PasswordResetService();
        passwordResetService.tokenRepository = tokenRepository;
        passwordResetService.userRepository = userRepository;
        passwordResetService.passwordEncoder = passwordEncoder;
    }

    @Test
    public void testCreatePasswordResetToken_UserExists() {
        String email = "test@example.com";
        User user = new User();
        user.setId(UUID.randomUUID());

        when(userRepository.findByEmailAddress(email)).thenReturn(Optional.of(user));
        when(tokenRepository.save(any(PasswordResetToken.class))).thenAnswer(i -> i.getArguments()[0]);

        PasswordResetToken result = passwordResetService.createPasswordResetToken(email);

        assertNotNull(result);
        assertEquals(user.getId(), result.getUserId());
    }

    @Test
    public void testCreatePasswordResetToken_UserNotFound() {
        when(userRepository.findByEmailAddress("missing@example.com")).thenReturn(Optional.empty());

        PasswordResetToken result = passwordResetService.createPasswordResetToken("missing@example.com");

        assertNull(result);
    }

    @Test
    public void testResetPassword_TokenNotFound() {
        when(tokenRepository.findByToken("invalid")).thenReturn(Optional.empty());

        boolean result = passwordResetService.resetPassword("invalid", "newPass");

        assertFalse(result);
    }

    @Test
    public void testResetPassword_TokenExpired() {
        PasswordResetToken token = mock(PasswordResetToken.class);
        when(token.isExpired()).thenReturn(true);
        when(tokenRepository.findByToken("expired")).thenReturn(Optional.of(token));

        boolean result = passwordResetService.resetPassword("expired", "newPass");

        assertFalse(result);
    }

    @Test
    public void testResetPassword_UserNotFound() {
        UUID userId = UUID.randomUUID();
        PasswordResetToken token = mock(PasswordResetToken.class);

        when(token.getUserId()).thenReturn(userId);
        when(token.isExpired()).thenReturn(false);
        when(tokenRepository.findByToken("token123")).thenReturn(Optional.of(token));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        boolean result = passwordResetService.resetPassword("token123", "newPass");

        assertFalse(result);
    }


    @Test
    public void testResetPassword_Success() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);

        PasswordResetToken token = new PasswordResetToken("token123", userId, LocalDateTime.now().plusMinutes(30));

        when(tokenRepository.findByToken("token123")).thenReturn(Optional.of(token));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPass")).thenReturn("encodedPass");

        boolean result = passwordResetService.resetPassword("token123", "newPass");

        assertTrue(result);
        assertEquals("encodedPass", user.getPassword());
        verify(userRepository).save(user);
        verify(tokenRepository).delete(token);
    }
}
