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
        return testRepository.save(test);
    }

    public void deleteTest(UUID id) {
        testRepository.deleteById(id);
    }
}
