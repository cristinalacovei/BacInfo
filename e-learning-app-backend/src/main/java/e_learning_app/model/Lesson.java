package e_learning_app.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lesson")
public class Lesson extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "class_level", nullable = false)
    private int classLevel; // 9, 10, 11, 12

    @OneToOne
    @JoinColumn(name = "test_id")
    private TestEntity test;
}
