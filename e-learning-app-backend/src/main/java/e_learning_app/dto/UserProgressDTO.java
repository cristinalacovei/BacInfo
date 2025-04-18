package e_learning_app.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserProgressDTO {
    private UUID userId;
    private UUID testId;
    private UUID lessonId;
    private Integer score;
    private LocalDateTime completedAt;
}

