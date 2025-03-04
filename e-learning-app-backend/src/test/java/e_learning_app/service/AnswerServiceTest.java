package e_learning_app.service;
import e_learning_app.model.Answer;
import e_learning_app.repository.AnswerRepository;
import e_learning_app.service.impl.AnswerService;
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
class AnswerServiceTest {

    @Mock
    private AnswerRepository answerRepository;

    @InjectMocks
    private AnswerService answerService;

    private Answer answer;
    private UUID answerId;
    private UUID questionId;

    @BeforeEach
    void setUp() {
        answerId = UUID.randomUUID();
        questionId = UUID.randomUUID();
        answer = Answer.builder()
                .id(answerId)
                .answerText("Encapsulation, Inheritance, Polymorphism, Abstraction")
                .isCorrect(true)
                .build();
    }

    @Test
    void testGetAnswersByQuestionId() {
        when(answerRepository.findByQuestionId(questionId)).thenReturn(List.of(answer));

        List<Answer> answers = answerService.getAnswersByQuestionId(questionId);

        assertFalse(answers.isEmpty());
        assertEquals(1, answers.size());
        assertTrue(answers.get(0).isCorrect());
    }

    @Test
    void testGetAnswerById() {
        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));

        Optional<Answer> foundAnswer = answerService.getAnswerById(answerId);

        assertTrue(foundAnswer.isPresent());
        assertTrue(foundAnswer.get().isCorrect());
    }

    @Test
    void testCreateAnswer() {
        when(answerRepository.save(any(Answer.class))).thenReturn(answer);

        Answer savedAnswer = answerService.createAnswer(answer);

        assertNotNull(savedAnswer);
        assertTrue(savedAnswer.isCorrect());
    }

    @Test
    void testDeleteAnswer() {
        doNothing().when(answerRepository).deleteById(answerId);

        answerService.deleteAnswer(answerId);

        verify(answerRepository, times(1)).deleteById(answerId);
    }
}

