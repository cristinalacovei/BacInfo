package e_learning_app.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "notificari")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificareEntity extends BaseEntity {

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mesaj;

    @Column(nullable = false, length = 50)
    private String tip; // LECTIE, TEST, FORUM

    @Column(nullable = false)
    private Date timestamp;

    @Column(name = "user_id")
    private UUID userId; // UUID, poate fi null

    @Column(nullable = false)
    private boolean citita = false;

    @Column(name = "target_id")
    private UUID targetId;

}
