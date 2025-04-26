package e_learning_app.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserDTO {

    private UUID id ;
    private String firstName;
    private String lastName;
    private String username;
    private String emailAddress;
    private String userRole;
    private String profileImageUrl;
}