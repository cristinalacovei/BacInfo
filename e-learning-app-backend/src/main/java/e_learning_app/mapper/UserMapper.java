package e_learning_app.mapper;

import e_learning_app.dto.UserDTO;
import e_learning_app.model.User;
import org.springframework.stereotype.Component;


@Component
public class UserMapper {

    public User toEntity(UserDTO userDTO) {
        return User.builder()
                .id(userDTO.getId())
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .username(userDTO.getUsername())
                .emailAddress(userDTO.getEmailAddress())
                .userRole(userDTO.getUserRole())
                .profileImageUrl(userDTO.getProfileImageUrl())
                .build();
    }

    public UserDTO toDto(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .emailAddress(user.getEmailAddress())
                .userRole(user.getUserRole())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}
