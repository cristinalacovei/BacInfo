package e_learning_app.repository;
import e_learning_app.model.UserAnswers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserAnswersRepository extends JpaRepository<UserAnswers, UUID> {
    List<UserAnswers> findByUserId(UUID userId);
    List<UserAnswers> findByQuestionId(UUID questionId);
}
