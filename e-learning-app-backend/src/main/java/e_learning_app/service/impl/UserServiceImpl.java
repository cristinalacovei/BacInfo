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
                    User placeholderUser = User.builder()
                            .emailAddress(email)
                            .firstName(firstName)
                            .lastName(lastName)
                            .username("temp_" + UUID.randomUUID())
                            .password(passwordEncoder.encode("")) // OAuth user
                            .userRole("PENDING")
                            .build();
                    return userRepository.save(placeholderUser);
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

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmailAddress(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilizatorul nu a fost găsit cu emailul: " + email));
    }

    @Override
    public User setUsername(String username, String email) {
        if (!isUsernameAvailable(username)) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = getUserByEmail(email); // metoda ta existentă
        user.setUsername(username);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(UUID id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setUsername(updatedUser.getUsername());
        user.setEmailAddress(updatedUser.getEmailAddress());
        user.setUserRole(updatedUser.getUserRole());

        // ✅ Salvează și avatarul dacă a fost schimbat
        user.setProfileImageUrl(updatedUser.getProfileImageUrl());

        return userRepository.save(user);
    }


    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<UUID> getAllUserIds() {
        return userRepository.findAll()
                .stream()
                .map(User::getId)
                .toList();
    }


}
