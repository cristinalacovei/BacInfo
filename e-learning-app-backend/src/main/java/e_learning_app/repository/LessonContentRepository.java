package e_learning_app.repository;

import e_learning_app.model.LessonContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonContentRepository extends JpaRepository<LessonContent, UUID> {
    List<LessonContent> findByLessonId(UUID lessonId);
}
