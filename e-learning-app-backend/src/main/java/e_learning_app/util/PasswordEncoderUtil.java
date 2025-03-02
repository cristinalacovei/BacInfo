package e_learning_app.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderUtil {
    public static void main(String[] args) {
        String hashedPassword = "$2a$10$48Kyah3ptnOi0YlAbahgfuky.UUTto0tjJ5fywn3i.mz2oazjVWZe";
        String userInputPassword = "Cristina"; // Înlocuiește cu parola pe care vrei să o testezi

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        boolean isMatch = encoder.matches(userInputPassword, hashedPassword);

        if (isMatch) {
            System.out.println("Parola este corectă!");
        } else {
            System.out.println("Parola este greșită.");
        }
    }
}
