package e_learning_app.service.impl;

import e_learning_app.model.TestEntity;
import e_learning_app.repository.TestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TestService {
    private final TestRepository testRepository;

    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    public List<TestEntity> getAllTests() {
        return testRepository.findAll();
    }

    public List<TestEntity> getTestsByClassLevel(int classLevel) {
        return testRepository.findByClassLevel(classLevel);
    }

    public Optional<TestEntity> getTestById(UUID id) {
        return testRepository.findById(id);
    }

    public TestEntity createTest(TestEntity test) {
        if (test.getQuestions() != null) {
            test.getQuestions().forEach(question -> {
                question.setTest(test);

                if (question.getAnswers() != null) {
                    question.getAnswers().forEach(answer -> {
                        answer.setQuestion(question);
                    });
                }
            });
        }

        return testRepository.save(test);
    }

    public void deleteTest(UUID id) {
        testRepository.deleteById(id);
    }

    public Optional<TestEntity> updateTest(UUID id, TestEntity updatedTest) {
        return testRepository.findById(id).map(existingTest -> {
            existingTest.setQuestions(updatedTest.getQuestions());
            return testRepository.save(existingTest);
        });
    }

    public UUID getLessonIdByTestId(UUID testId) {
        return testRepository.findById(testId)
                .map(test -> test.getLesson().getId())
                .orElseThrow(() -> new IllegalArgumentException("Test not found or lesson is null"));
    }

}
