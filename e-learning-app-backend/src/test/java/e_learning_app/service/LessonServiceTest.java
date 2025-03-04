package e_learning_app.service;

import e_learning_app.model.Lesson;
import e_learning_app.repository.LessonRepository;
import e_learning_app.service.impl.LessonService;
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
class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private LessonService lessonService;

    private Lesson lesson;
    private UUID lessonId;

    @BeforeEach
    void setUp() {
        lessonId = UUID.randomUUID();
        lesson = Lesson.builder()
                .id(lessonId)
                .title("Test Lesson")
                .description("Description for test lesson")
                .classLevel(10)
                .build();
    }

    @Test
    void testGetAllLessons() {
        when(lessonRepository.findAll()).thenReturn(List.of(lesson));

        List<Lesson> lessons = lessonService.getAllLessons();

        assertFalse(lessons.isEmpty());
        assertEquals(1, lessons.size());
        assertEquals("Test Lesson", lessons.get(0).getTitle());
    }

    @Test
    void testGetLessonById() {
        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(lesson));

        Optional<Lesson> foundLesson = lessonService.getLessonById(lessonId);

        assertTrue(foundLesson.isPresent());
        assertEquals("Test Lesson", foundLesson.get().getTitle());
    }

    @Test
    void testCreateLesson() {
        when(lessonRepository.save(any(Lesson.class))).thenReturn(lesson);

        Lesson savedLesson = lessonService.createLesson(lesson);

        assertNotNull(savedLesson);
        assertEquals("Test Lesson", savedLesson.getTitle());
    }

    @Test
    void testDeleteLesson() {
        doNothing().when(lessonRepository).deleteById(lessonId);

        lessonService.deleteLesson(lessonId);

        verify(lessonRepository, times(1)).deleteById(lessonId);
    }
}
