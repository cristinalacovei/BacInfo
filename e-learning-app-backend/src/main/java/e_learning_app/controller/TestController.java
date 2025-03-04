package e_learning_app.controller;
import e_learning_app.model.TestEntity;
import e_learning_app.service.impl.TestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/tests")
public class TestController {
    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping
    public ResponseEntity<List<TestEntity>> getAllTests() {
        return ResponseEntity.ok(testService.getAllTests());
    }

    @GetMapping("/class/{classLevel}")
    public ResponseEntity<List<TestEntity>> getTestsByClassLevel(@PathVariable int classLevel) {
        return ResponseEntity.ok(testService.getTestsByClassLevel(classLevel));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestEntity> getTestById(@PathVariable UUID id) {
        Optional<TestEntity> test = testService.getTestById(id);
        return test.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TestEntity> createTest(@RequestBody TestEntity test) {
        return ResponseEntity.ok(testService.createTest(test));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable UUID id) {
        testService.deleteTest(id);
        return ResponseEntity.noContent().build();
    }
}
