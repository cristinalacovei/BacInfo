package e_learning_app.service.impl;
import e_learning_app.model.Question;
import e_learning_app.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getQuestionsByTestId(UUID testId) {
        return questionRepository.findByTestId(testId);
    }

    public Optional<Question> getQuestionById(UUID id) {
        return questionRepository.findById(id);
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public void deleteQuestion(UUID id) {
        questionRepository.deleteById(id);
    }
}
