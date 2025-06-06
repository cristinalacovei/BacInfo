
package e_learning_app.service;

import e_learning_app.model.Lesson;
import e_learning_app.model.TestEntity;
import e_learning_app.repository.LessonRepository;
import e_learning_app.repository.TestRepository;
import e_learning_app.service.impl.LessonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class LessonServiceTest {

    private LessonRepository lessonRepository;
    private TestRepository testRepository;
    private LessonService lessonService;

    @BeforeEach
    public void setUp() {
        lessonRepository = mock(LessonRepository.class);
        testRepository = mock(TestRepository.class);
        lessonService = new LessonService(lessonRepository, testRepository);
    }

    @Test
    public void testGetAllLessons() {
        List<Lesson> lessons = List.of(new Lesson(), new Lesson());
        when(lessonRepository.findAll()).thenReturn(lessons);

        List<Lesson> result = lessonService.getAllLessons();

        assertEquals(2, result.size());
        verify(lessonRepository).findAll();
    }

    @Test
    public void testGetLessonsByClassLevel() {
        int classLevel = 5;
        List<Lesson> lessons = List.of(new Lesson());
        when(lessonRepository.findByClassLevel(classLevel)).thenReturn(lessons);

        List<Lesson> result = lessonService.getLessonsByClassLevel(classLevel);

        assertEquals(1, result.size());
        verify(lessonRepository).findByClassLevel(classLevel);
    }

    @Test
    public void testGetLessonById() {
        UUID id = UUID.randomUUID();
        Lesson lesson = new Lesson();
        when(lessonRepository.findById(id)).thenReturn(Optional.of(lesson));

        Optional<Lesson> result = lessonService.getLessonById(id);

        assertTrue(result.isPresent());
        verify(lessonRepository).findById(id);
    }

    @Test
    public void testCreateLesson() {
        Lesson lesson = new Lesson();
        when(lessonRepository.save(lesson)).thenReturn(lesson);

        Lesson saved = lessonService.createLesson(lesson);

        assertNotNull(saved);
        verify(lessonRepository).save(lesson);
    }

    @Test
    public void testDeleteLesson() {
        UUID id = UUID.randomUUID();
        lessonService.deleteLesson(id);
        verify(lessonRepository).deleteById(id);
    }

    @Test
    public void testUpdateLesson() {
        UUID id = UUID.randomUUID();
        Lesson existing = new Lesson();
        Lesson updated = new Lesson();
        updated.setTitle("New Title");
        updated.setDescription("New Desc");
        updated.setContent("New Content");

        when(lessonRepository.findById(id)).thenReturn(Optional.of(existing));
        when(lessonRepository.save(existing)).thenReturn(existing);

        Optional<Lesson> result = lessonService.updateLesson(id, updated);

        assertTrue(result.isPresent());
        assertEquals("New Title", result.get().getTitle());
        assertEquals("New Desc", result.get().getDescription());
        assertEquals("New Content", result.get().getContent());
        verify(lessonRepository).save(existing);
    }

    @Test
    public void testGetTestByLessonId() {
        UUID lessonId = UUID.randomUUID();
        TestEntity test = new TestEntity();
        when(testRepository.findByLessonId(lessonId)).thenReturn(Optional.of(test));

        Optional<TestEntity> result = lessonService.getTestByLessonId(lessonId);

        assertTrue(result.isPresent());
        verify(testRepository).findByLessonId(lessonId);
    }
}
