package e_learning_app.service.impl;

import e_learning_app.model.PublicAnswer;
import e_learning_app.model.PublicQuestion;
import e_learning_app.repository.PublicAnswerRepository;
import e_learning_app.repository.PublicQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ForumService {

    private final PublicQuestionRepository questionRepository;
    private final PublicAnswerRepository answerRepository;

    public ForumService(PublicQuestionRepository questionRepository, PublicAnswerRepository answerRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    public List<PublicQuestion> getAllQuestions() {
        return questionRepository.findAll();
    }

    public PublicQuestion postQuestion(PublicQuestion question) {
        return questionRepository.save(question);
    }

    public void deleteQuestion(UUID id) {
        if (!questionRepository.existsById(id)) {
            throw new IllegalArgumentException("Întrebarea nu există.");
        }
        questionRepository.deleteById(id);
    }

    public void deleteAnswer(UUID id) {
        if (!answerRepository.existsById(id)) {
            throw new IllegalArgumentException("Raspunsul nu există.");
        }
        answerRepository.deleteById(id);
    }

    public List<PublicAnswer> getAnswersForQuestion(UUID questionId) {
        return answerRepository.findByQuestionId(questionId);
    }

    public PublicAnswer postAnswer(PublicAnswer answer) {
        return answerRepository.save(answer);
    }
    public PublicQuestion getQuestionById(UUID id) {
        return questionRepository.findById(id).orElseThrow();
    }


}

