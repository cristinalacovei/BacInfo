package e_learning_app.controller;

import e_learning_app.model.UserAnswers;
import e_learning_app.service.impl.UserAnswerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-answers")
public class UserAnswerController {
    private final UserAnswerService userAnswerService;

    public UserAnswerController(UserAnswerService userAnswerService) {
        this.userAnswerService = userAnswerService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAnswers>> getAnswersByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userAnswerService.getAnswersByUserId(userId));
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<UserAnswers>> getAnswersByQuestionId(@PathVariable UUID questionId) {
        return ResponseEntity.ok(userAnswerService.getAnswersByQuestionId(questionId));
    }

    @PostMapping
    public ResponseEntity<UserAnswers> saveUserAnswer(@RequestBody UserAnswers userAnswer) {
        return ResponseEntity.ok(userAnswerService.saveUserAnswer(userAnswer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAnswer(@PathVariable UUID id) {
        userAnswerService.deleteUserAnswer(id);
        return ResponseEntity.noContent().build();
    }
}
