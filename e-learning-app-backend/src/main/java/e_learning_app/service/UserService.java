package e_learning_app.service;



import e_learning_app.model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
    List<User> getAllUsers();
    User createUser(User user);
    User getUserByUsername(String username);
    boolean isUsernameAvailable(String username);
    boolean isEmailAvailable(String email);
}

