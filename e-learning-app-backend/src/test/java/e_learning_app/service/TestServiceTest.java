
package e_learning_app.service;

import e_learning_app.model.Lesson;
import e_learning_app.model.TestEntity;
import e_learning_app.model.Question;
import e_learning_app.model.Answer;
import e_learning_app.repository.TestRepository;
import e_learning_app.service.impl.TestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TestServiceTest {

    private TestRepository testRepository;
    private TestService testService;

    @BeforeEach
    public void setUp() {
        testRepository = mock(TestRepository.class);
        testService = new TestService(testRepository);
    }

    @Test
    public void testGetAllTests() {
        List<TestEntity> mockTests = Arrays.asList(new TestEntity(), new TestEntity());
        when(testRepository.findAll()).thenReturn(mockTests);

        List<TestEntity> result = testService.getAllTests();

        assertEquals(2, result.size());
        verify(testRepository, times(1)).findAll();
    }

    @Test
    public void testGetTestsByClassLevel() {
        List<TestEntity> mockTests = Arrays.asList(new TestEntity());
        when(testRepository.findByClassLevel(5)).thenReturn(mockTests);

        List<TestEntity> result = testService.getTestsByClassLevel(5);

        assertEquals(1, result.size());
        verify(testRepository, times(1)).findByClassLevel(5);
    }

    @Test
    public void testGetTestById() {
        UUID id = UUID.randomUUID();
        TestEntity test = new TestEntity();
        when(testRepository.findById(id)).thenReturn(Optional.of(test));

        Optional<TestEntity> result = testService.getTestById(id);

        assertTrue(result.isPresent());
        verify(testRepository).findById(id);
    }

    @Test
    public void testCreateTestWithNestedEntities() {
        TestEntity test = new TestEntity();
        Question question = new Question();
        Answer answer = new Answer();
        question.setAnswers(List.of(answer));
        test.setQuestions(List.of(question));

        when(testRepository.save(any(TestEntity.class))).thenReturn(test);

        TestEntity saved = testService.createTest(test);

        assertNotNull(saved);
        assertEquals(test, question.getTest());
        assertEquals(question, answer.getQuestion());
        verify(testRepository).save(test);
    }

    @Test
    public void testDeleteTest() {
        UUID id = UUID.randomUUID();
        testService.deleteTest(id);
        verify(testRepository).deleteById(id);
    }

    @Test
    public void testUpdateTest() {
        UUID id = UUID.randomUUID();
        TestEntity existingTest = new TestEntity();
        TestEntity updatedTest = new TestEntity();
        updatedTest.setQuestions(List.of(new Question()));

        when(testRepository.findById(id)).thenReturn(Optional.of(existingTest));
        when(testRepository.save(existingTest)).thenReturn(existingTest);

        Optional<TestEntity> result = testService.updateTest(id, updatedTest);

        assertTrue(result.isPresent());
        assertEquals(updatedTest.getQuestions(), result.get().getQuestions());
        verify(testRepository).save(existingTest);
    }

    @Test
    public void testGetLessonIdByTestIdWhenFound() {
        UUID testId = UUID.randomUUID();
        UUID lessonId = UUID.randomUUID();

        Lesson lesson = mock(Lesson.class);  // <-- Mock corect
        when(lesson.getId()).thenReturn(lessonId);

        TestEntity test = mock(TestEntity.class);
        when(test.getLesson()).thenReturn(lesson);

        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        UUID result = testService.getLessonIdByTestId(testId);

        assertEquals(lessonId, result);
    }


    @Test
    public void testGetLessonIdByTestIdWhenNotFound() {
        UUID testId = UUID.randomUUID();
        when(testRepository.findById(testId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> testService.getLessonIdByTestId(testId));
    }
}
