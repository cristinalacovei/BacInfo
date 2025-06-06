package e_learning_app.service;

import e_learning_app.model.Answer;
import e_learning_app.model.Question;
import e_learning_app.repository.AnswerRepository;
import e_learning_app.service.impl.AnswerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AnswerServiceTest {

    private AnswerRepository answerRepository;
    private AnswerService answerService;

    @BeforeEach
    void setUp() {
        answerRepository = mock(AnswerRepository.class);
        answerService = new AnswerService(answerRepository);
    }

    @Test
    void testGetAnswersByQuestionId() {
        UUID questionId = UUID.randomUUID();
        List<Answer> expectedAnswers = List.of(new Answer());
        when(answerRepository.findByQuestionId(questionId)).thenReturn(expectedAnswers);

        List<Answer> result = answerService.getAnswersByQuestionId(questionId);
        assertEquals(expectedAnswers, result);
    }

    @Test
    void testGetAnswerById() {
        UUID id = UUID.randomUUID();
        Answer answer = new Answer();
        when(answerRepository.findById(id)).thenReturn(Optional.of(answer));

        Optional<Answer> result = answerService.getAnswerById(id);
        assertTrue(result.isPresent());
        assertEquals(answer, result.get());
    }

    @Test
    void testCreateAnswer() {
        Answer answer = new Answer();
        when(answerRepository.save(answer)).thenReturn(answer);

        Answer result = answerService.createAnswer(answer);
        assertEquals(answer, result);
    }

    @Test
    void testDeleteAnswer() {
        UUID id = UUID.randomUUID();
        doNothing().when(answerRepository).deleteById(id);

        answerService.deleteAnswer(id);
        verify(answerRepository, times(1)).deleteById(id);
    }

    @Test
    void testValidateAnswersWithScore() {
        UUID questionId = UUID.randomUUID();
        UUID correctAnswerId = UUID.randomUUID();
        UUID wrongAnswerId = UUID.randomUUID();

        Question question = new Question();
        question.setId(questionId);

        Answer correctAnswer = new Answer();
        correctAnswer.setId(correctAnswerId);
        correctAnswer.setQuestion(question);
        correctAnswer.setCorrect(true);

        Answer wrongAnswer = new Answer();
        wrongAnswer.setId(wrongAnswerId);
        wrongAnswer.setQuestion(question);
        wrongAnswer.setCorrect(false);

        List<UUID> selectedIds = List.of(correctAnswerId);
        when(answerRepository.findAllById(selectedIds)).thenReturn(List.of(correctAnswer));
        when(answerRepository.findByQuestionId(questionId)).thenReturn(List.of(correctAnswer, wrongAnswer));

        Map<String, Object> result = answerService.validateAnswersWithScore(selectedIds);

        assertEquals(1, result.get("correctAnswers"));
        assertEquals(1, result.get("totalQuestions"));
        assertTrue(((List<?>) result.get("correctAnswerIds")).contains(correctAnswerId));
        assertTrue(((List<?>) result.get("incorrectAnswerIds")).isEmpty());
    }
}