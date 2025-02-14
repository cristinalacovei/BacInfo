package e_learning_app.repository;

import e_learning_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    boolean existsByUsernameOrEmailAddress(String username, String emailAddress);
    boolean existsByUsername(String username);
    boolean existsByEmailAddress(String emailAddress);
}


