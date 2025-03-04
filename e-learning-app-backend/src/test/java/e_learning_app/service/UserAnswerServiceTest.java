package e_learning_app.service;

import e_learning_app.model.UserAnswers;
import e_learning_app.repository.UserAnswersRepository;
import e_learning_app.service.impl.UserAnswerService;
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
class UserAnswerServiceTest {

    @Mock
    private UserAnswersRepository userAnswersRepository;

    @InjectMocks
    private UserAnswerService userAnswerService;

    private UserAnswers userAnswer;
    private UUID answerId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        answerId = UUID.randomUUID();
        userId = UUID.randomUUID();
        userAnswer = UserAnswers.builder()
                .id(answerId)
                .build();
    }

    @Test
    void testGetAnswersByUserId() {
        when(userAnswersRepository.findByUserId(userId)).thenReturn(List.of(userAnswer));

        List<UserAnswers> answers = userAnswerService.getAnswersByUserId(userId);

        assertFalse(answers.isEmpty());
        assertEquals(1, answers.size());
    }

    @Test
    void testGetUserAnswerById() {
        when(userAnswersRepository.findById(answerId)).thenReturn(Optional.of(userAnswer));

        Optional<UserAnswers> foundAnswer = userAnswerService.getUserAnswerById(answerId);

        assertTrue(foundAnswer.isPresent());
    }

    @Test
    void testSaveUserAnswer() {
        when(userAnswersRepository.save(any(UserAnswers.class))).thenReturn(userAnswer);

        UserAnswers savedAnswer = userAnswerService.saveUserAnswer(userAnswer);

        assertNotNull(savedAnswer);
    }

    @Test
    void testDeleteUserAnswer() {
        doNothing().when(userAnswersRepository).deleteById(answerId);

        userAnswerService.deleteUserAnswer(answerId);

        verify(userAnswersRepository, times(1)).deleteById(answerId);
    }
}

