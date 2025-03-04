package e_learning_app.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.UUID;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lesson_content")
public class LessonContent extends BaseEntity {

    @Column(name = "content_type", nullable = false)
    private String contentType; // TEXT, IMAGE, VIDEO, SCHEME

    @Column(name = "content_url", columnDefinition = "TEXT")
    private String contentUrl;

    @Column(name = "text_content", columnDefinition = "TEXT")
    private String textContent;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;
}
