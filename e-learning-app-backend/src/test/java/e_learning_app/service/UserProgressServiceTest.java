
package e_learning_app.service;

import e_learning_app.dto.UserProgressDTO;
import e_learning_app.model.Lesson;
import e_learning_app.model.TestEntity;
import e_learning_app.model.User;
import e_learning_app.model.UserProgress;
import e_learning_app.repository.LessonRepository;
import e_learning_app.repository.TestRepository;
import e_learning_app.repository.UserProgressRepository;
import e_learning_app.repository.UserRepository;
import e_learning_app.service.impl.UserProgressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserProgressServiceTest {

    private UserProgressRepository userProgressRepository;
    private UserRepository userRepository;
    private TestRepository testRepository;
    private LessonRepository lessonRepository;
    private UserProgressService userProgressService;

    @BeforeEach
    public void setUp() {
        userProgressRepository = mock(UserProgressRepository.class);
        userRepository = mock(UserRepository.class);
        testRepository = mock(TestRepository.class);
        lessonRepository = mock(LessonRepository.class);
        userProgressService = new UserProgressService(userProgressRepository, userRepository, testRepository, lessonRepository);
    }

    @Test
    public void testSaveProgress_withLesson() {
        UUID userId = UUID.randomUUID();
        UUID testId = UUID.randomUUID();
        UUID lessonId = UUID.randomUUID();
        LocalDateTime completedAt = LocalDateTime.now();

        User user = new User();
        user.setId(userId);
        TestEntity test = new TestEntity();
        test.setId(testId);
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);

        UserProgressDTO dto = new UserProgressDTO();
        dto.setUserId(userId);
        dto.setTestId(testId);
        dto.setLessonId(lessonId);
        dto.setScore(90);
        dto.setCompletedAt(completedAt);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(lesson));
        when(userProgressRepository.save(any(UserProgress.class))).thenAnswer(i -> i.getArguments()[0]);

        UserProgress result = userProgressService.saveProgress(dto);

        assertEquals(user, result.getUser());
        assertEquals(test, result.getTest());
        assertEquals(lesson, result.getLesson());
        assertEquals(90, result.getScore());
        assertEquals(completedAt, result.getCompletedAt());
    }

    @Test
    public void testGetProgressByUserId() {
        UUID userId = UUID.randomUUID();
        List<UserProgress> progresses = List.of(new UserProgress(), new UserProgress());
        when(userProgressRepository.findByUserId(userId)).thenReturn(progresses);

        List<UserProgress> result = userProgressService.getProgressByUserId(userId);

        assertEquals(2, result.size());
        verify(userProgressRepository).findByUserId(userId);
    }

    @Test
    public void testGetProgressById() {
        UUID id = UUID.randomUUID();
        UserProgress progress = new UserProgress();
        when(userProgressRepository.findById(id)).thenReturn(Optional.of(progress));

        Optional<UserProgress> result = userProgressService.getProgressById(id);

        assertTrue(result.isPresent());
        verify(userProgressRepository).findById(id);
    }

    @Test
    public void testGetLatestProgressPerLesson() {
        UUID userId = UUID.randomUUID();
        UUID lessonId = UUID.randomUUID();
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);

        User user = new User();
        user.setId(userId);

        TestEntity test = new TestEntity();
        test.setId(UUID.randomUUID());

        UserProgress oldProgress = new UserProgress();
        oldProgress.setLesson(lesson);
        oldProgress.setUser(user);
        oldProgress.setTest(test);
        oldProgress.setScore(60);
        oldProgress.setCompletedAt(LocalDateTime.now().minusDays(1));

        UserProgress newProgress = new UserProgress();
        newProgress.setLesson(lesson);
        newProgress.setUser(user);
        newProgress.setTest(test);
        newProgress.setScore(85);
        newProgress.setCompletedAt(LocalDateTime.now());

        when(userProgressRepository.findByUserId(userId)).thenReturn(List.of(oldProgress, newProgress));

        List<UserProgressDTO> result = userProgressService.getLatestProgressPerLesson(userId);

        assertEquals(1, result.size());
        assertEquals(85, result.get(0).getScore());
    }
}
