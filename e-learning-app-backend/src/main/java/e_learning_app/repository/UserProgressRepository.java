package e_learning_app.repository;

import e_learning_app.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    List<UserProgress> findByUserId(UUID userId);
    List<UserProgress> findByLessonId(UUID lessonId);
    List<UserProgress> findByTestId(UUID testId);
}
