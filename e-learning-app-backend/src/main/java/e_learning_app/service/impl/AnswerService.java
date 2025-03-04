package e_learning_app.service.impl;

import e_learning_app.model.Answer;
import e_learning_app.repository.AnswerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AnswerService {
    private final AnswerRepository answerRepository;

    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public List<Answer> getAnswersByQuestionId(UUID questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    public Optional<Answer> getAnswerById(UUID id) {
        return answerRepository.findById(id);
    }

    public Answer createAnswer(Answer answer) {
        return answerRepository.save(answer);
    }

    public void deleteAnswer(UUID id) {
        answerRepository.deleteById(id);
    }
}
