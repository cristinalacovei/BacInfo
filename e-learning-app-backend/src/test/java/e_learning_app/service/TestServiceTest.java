package e_learning_app.service;

import e_learning_app.model.TestEntity;
import e_learning_app.repository.TestRepository;
import e_learning_app.service.impl.TestService;
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
class TestServiceTest {

    @Mock
    private TestRepository testRepository;

    @InjectMocks
    private TestService testService;

    private TestEntity test;
    private UUID testId;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        test = TestEntity.builder()
                .id(testId)
                .classLevel(11)
                .build();
    }

    @Test
    void testGetAllTests() {
        when(testRepository.findAll()).thenReturn(List.of(test));

        List<TestEntity> tests = testService.getAllTests();

        assertFalse(tests.isEmpty());
        assertEquals(1, tests.size());
    }

    @Test
    void testGetTestById() {
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        Optional<TestEntity> foundTest = testService.getTestById(testId);

        assertTrue(foundTest.isPresent());
        assertEquals(11, foundTest.get().getClassLevel());
    }

    @Test
    void testCreateTest() {
        when(testRepository.save(any(TestEntity.class))).thenReturn(test);

        TestEntity savedTest = testService.createTest(test);

        assertNotNull(savedTest);
        assertEquals(11, savedTest.getClassLevel());
    }

    @Test
    void testDeleteTest() {
        doNothing().when(testRepository).deleteById(testId);

        testService.deleteTest(testId);

        verify(testRepository, times(1)).deleteById(testId);
    }
}
