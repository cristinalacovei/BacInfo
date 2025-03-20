package e_learning_app.repository;

import e_learning_app.model.Lesson;
import e_learning_app.model.TestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TestRepository extends JpaRepository<TestEntity, UUID> {
    List<TestEntity> findByClassLevel(int classLevel);
    Optional<TestEntity> findByLesson(Lesson lesson);
    Optional<TestEntity> findByLessonId(UUID lessonId);



}

