package e_learning_app.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.List;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "test")
public class TestEntity extends BaseEntity {

    @Column(name = "class_level", nullable = false)
    private int classLevel; // Test pentru un an de studiu

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    @JsonManagedReference // ✅ Evită serializarea infinită
    private List<Question> questions;

    @OneToOne
    @JoinColumn(name = "lesson_id", referencedColumnName = "id")
    private Lesson lesson;

}
