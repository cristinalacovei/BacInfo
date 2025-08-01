package e_learning_app.controller;

import e_learning_app.model.Answer;
import e_learning_app.service.impl.AnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {
    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<Answer>> getAnswersByQuestionId(@PathVariable UUID questionId) {
        return ResponseEntity.ok(answerService.getAnswersByQuestionId(questionId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Answer> getAnswerById(@PathVariable UUID id) {
        Optional<Answer> answer = answerService.getAnswerById(id);
        return answer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Answer> createAnswer(@RequestBody Answer answer) {
        return ResponseEntity.ok(answerService.createAnswer(answer));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable UUID id) {
        answerService.deleteAnswer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/validate-score")
    public ResponseEntity<Map<String, Object>> validateAnswersWithScore(@RequestBody List<UUID> selectedAnswerIds) {
        Map<String, Object> result = answerService.validateAnswersWithScore(selectedAnswerIds);
        return ResponseEntity.ok(result);
    }



}

