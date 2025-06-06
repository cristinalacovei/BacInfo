
package e_learning_app.service;

import e_learning_app.model.Question;
import e_learning_app.repository.QuestionRepository;
import e_learning_app.service.impl.QuestionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class QuestionServiceTest {

    private QuestionRepository questionRepository;
    private QuestionService questionService;

    @BeforeEach
    public void setUp() {
        questionRepository = mock(QuestionRepository.class);
        questionService = new QuestionService(questionRepository);
    }

    @Test
    public void testGetQuestionsByTestId() {
        UUID testId = UUID.randomUUID();
        List<Question> questions = List.of(new Question(), new Question());
        when(questionRepository.findByTestId(testId)).thenReturn(questions);

        List<Question> result = questionService.getQuestionsByTestId(testId);

        assertEquals(2, result.size());
        verify(questionRepository, times(1)).findByTestId(testId);
    }

    @Test
    public void testGetQuestionById() {
        UUID questionId = UUID.randomUUID();
        Question question = new Question();
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));

        Optional<Question> result = questionService.getQuestionById(questionId);

        assertTrue(result.isPresent());
        verify(questionRepository).findById(questionId);
    }

    @Test
    public void testCreateQuestion() {
        Question question = new Question();
        when(questionRepository.save(question)).thenReturn(question);

        Question saved = questionService.createQuestion(question);

        assertNotNull(saved);
        verify(questionRepository).save(question);
    }

    @Test
    public void testDeleteQuestion() {
        UUID id = UUID.randomUUID();
        questionService.deleteQuestion(id);
        verify(questionRepository).deleteById(id);
    }
}
