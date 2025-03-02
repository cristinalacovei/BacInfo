package e_learning_app.service.impl;

import e_learning_app.model.User;
import e_learning_app.repository.UserRepository;
import e_learning_app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User findByEmailOrCreate(String email, String firstName, String lastName) {
        return userRepository.findByEmailAddress(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .emailAddress(email)
                            .firstName(firstName)
                            .lastName(lastName)
                            .username(email)
                            .password(passwordEncoder.encode("")) // Empty password for OAuth users
                            .userRole("USER")
                            .build();
                    return userRepository.save(newUser);
                });
    }

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User createUser(User user) {

        boolean userExists = userRepository.existsByUsernameOrEmailAddress(user.getUsername(), user.getEmailAddress());

        if (userExists) {
            throw new IllegalArgumentException("A user with the same username or email address already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
    }
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmailAddress(email);
    }

}
