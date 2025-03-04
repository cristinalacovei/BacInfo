package e_learning_app.service;

import e_learning_app.model.Question;
import e_learning_app.repository.QuestionRepository;
import e_learning_app.service.impl.QuestionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuestionService questionService;

    private Question question;
    private UUID questionId;
    private UUID testId;

    @BeforeEach
    void setUp() {
        questionId = UUID.randomUUID();
        testId = UUID.randomUUID();
        question = Question.builder()
                .id(questionId)
                .questionText("What is OOP?")
                .questionType("SINGLE_CHOICE")
                .build();
    }

    @Test
    void testGetQuestionsByTestId() {
        when(questionRepository.findByTestId(testId)).thenReturn(List.of(question));

        List<Question> questions = questionService.getQuestionsByTestId(testId);

        assertFalse(questions.isEmpty());
        assertEquals(1, questions.size());
        assertEquals("What is OOP?", questions.get(0).getQuestionText());
    }

    @Test
    void testGetQuestionById() {
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));

        Optional<Question> foundQuestion = questionService.getQuestionById(questionId);

        assertTrue(foundQuestion.isPresent());
        assertEquals("What is OOP?", foundQuestion.get().getQuestionText());
    }

    @Test
    void testCreateQuestion() {
        when(questionRepository.save(any(Question.class))).thenReturn(question);

        Question savedQuestion = questionService.createQuestion(question);

        assertNotNull(savedQuestion);
        assertEquals("What is OOP?", savedQuestion.getQuestionText());
    }

    @Test
    void testDeleteQuestion() {
        doNothing().when(questionRepository).deleteById(questionId);

        questionService.deleteQuestion(questionId);

        verify(questionRepository, times(1)).deleteById(questionId);
    }
}
