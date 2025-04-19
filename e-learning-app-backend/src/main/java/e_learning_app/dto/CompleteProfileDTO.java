package e_learning_app.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompleteProfileDTO {
    private String email;
    private String username;
    private String userRole;
}