package e_learning_app.service.impl;

import e_learning_app.model.Answer;
import e_learning_app.model.Question;
import e_learning_app.repository.AnswerRepository;
import org.springframework.stereotype.Service;

import java.util.*;

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

    public Map<String, Object> validateAnswersWithScore(List<UUID> selectedAnswerIds) {
        if (selectedAnswerIds.isEmpty()) {
            return Map.of("correctAnswers", 0, "totalQuestions", 0, "correctAnswerIds", List.of(), "incorrectAnswerIds", List.of());
        }

        List<Answer> selectedAnswers = answerRepository.findAllById(selectedAnswerIds);
        System.out.println(" DEBUG: Răspunsuri selectate de utilizator: " + selectedAnswerIds);

        Map<UUID, List<Answer>> questionAnswersMap = new HashMap<>();
        for (Answer answer : selectedAnswers) {
            UUID questionId = answer.getQuestion().getId();
            questionAnswersMap.putIfAbsent(questionId, answerRepository.findByQuestionId(questionId));
        }

        int correctQuestions = 0;
        int totalQuestions = questionAnswersMap.size();
        List<UUID> correctAnswerIds = new ArrayList<>();
        List<UUID> incorrectAnswerIds = new ArrayList<>();

        System.out.println(" DEBUG: Total întrebări: " + totalQuestions);

        for (Map.Entry<UUID, List<Answer>> entry : questionAnswersMap.entrySet()) {
            UUID questionId = entry.getKey();
            List<Answer> correctAnswers = entry.getValue().stream()
                    .filter(Answer::isCorrect)
                    .toList();

            List<Answer> selectedForQuestion = selectedAnswers.stream()
                    .filter(a -> a.getQuestion().getId().equals(questionId))
                    .toList();

            List<UUID> selectedCorrectIds = selectedForQuestion.stream()
                    .filter(Answer::isCorrect)
                    .map(Answer::getId)
                    .toList();

            List<UUID> selectedIncorrectIds = selectedForQuestion.stream()
                    .filter(a -> !a.isCorrect())
                    .map(Answer::getId)
                    .toList();

            correctAnswerIds.addAll(selectedCorrectIds);
            incorrectAnswerIds.addAll(selectedIncorrectIds);

            System.out.println("🟢 Întrebare ID: " + questionId);
            System.out.println("✅ Răspunsuri corecte: " + correctAnswers);
            System.out.println("🟩 Răspunsuri corecte selectate: " + selectedCorrectIds);
            System.out.println("🟥 Răspunsuri greșite selectate: " + selectedIncorrectIds);

            if (selectedCorrectIds.size() == correctAnswers.size() && selectedIncorrectIds.isEmpty()) {
                correctQuestions++;
            }
        }

        System.out.println("🎯 Întrebări răspunse corect: " + correctQuestions);


        return Map.of(
                "correctAnswers", correctQuestions,
                "totalQuestions", totalQuestions,
                "correctAnswerIds", correctAnswerIds,
                "incorrectAnswerIds", incorrectAnswerIds
        );
    }




}
