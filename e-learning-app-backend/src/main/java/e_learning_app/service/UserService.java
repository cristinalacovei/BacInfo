package e_learning_app.service;



import e_learning_app.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
    List<User> getAllUsers();
    User createUser(User user);
    User getUserByUsername(String username);
    boolean isUsernameAvailable(String username);
    boolean isEmailAvailable(String email);
    User findByEmailOrCreate(String email, String firstName, String lastName);
    User getUserByEmail(String email);
    User setUsername(String username, String email);
    User save(User user);
     User updateUser(UUID id, User updatedUser);

    List<UUID> getAllUserIds();
}

