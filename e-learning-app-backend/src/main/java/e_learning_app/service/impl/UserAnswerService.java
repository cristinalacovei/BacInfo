package e_learning_app.service.impl;

import e_learning_app.model.UserAnswers;
import e_learning_app.repository.UserAnswersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserAnswerService {
    private final UserAnswersRepository userAnswersRepository;

    public UserAnswerService(UserAnswersRepository userAnswersRepository) {
        this.userAnswersRepository = userAnswersRepository;
    }

    public List<UserAnswers> getAnswersByUserId(UUID userId) {
        return userAnswersRepository.findByUserId(userId);
    }

    public List<UserAnswers> getAnswersByQuestionId(UUID questionId) {
        return userAnswersRepository.findByQuestionId(questionId);
    }

    public Optional<UserAnswers> getUserAnswerById(UUID id) {
        return userAnswersRepository.findById(id);
    }

    public UserAnswers saveUserAnswer(UserAnswers userAnswer) {
        return userAnswersRepository.save(userAnswer);
    }

    public void deleteUserAnswer(UUID id) {
        userAnswersRepository.deleteById(id);
    }
}

