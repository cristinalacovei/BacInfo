package e_learning_app.repository;
import e_learning_app.model.PublicQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PublicQuestionRepository extends JpaRepository<PublicQuestion, UUID> {
}

