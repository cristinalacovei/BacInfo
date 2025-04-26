package e_learning_app.controller;

import e_learning_app.model.PublicAnswer;
import e_learning_app.model.PublicQuestion;
import e_learning_app.service.impl.ForumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final ForumService forumService;

    public ForumController(ForumService forumService) {
        this.forumService = forumService;
    }

    // ✅ toate întrebările
    @GetMapping("/questions")
    public ResponseEntity<List<PublicQuestion>> getAllQuestions() {
        return ResponseEntity.ok(forumService.getAllQuestions());
    }

    // ✅ postează întrebare nouă
    @PostMapping("/questions")
    public ResponseEntity<PublicQuestion> postQuestion(@RequestBody PublicQuestion question) {
        return ResponseEntity.ok(forumService.postQuestion(question));
    }

    // ✅ răspunsurile pentru o întrebare
    @GetMapping("/questions/{id}/answers")
    public ResponseEntity<List<PublicAnswer>> getAnswers(@PathVariable UUID id) {
        return ResponseEntity.ok(forumService.getAnswersForQuestion(id));
    }

    // ✅ adaugă răspuns la o întrebare
    @PostMapping("/questions/{id}/answers")
    public ResponseEntity<PublicAnswer> postAnswer(@PathVariable UUID id, @RequestBody PublicAnswer answer) {
        PublicQuestion q = new PublicQuestion();
        q.setId(id);
        answer.setQuestion(q);
        return ResponseEntity.ok(forumService.postAnswer(answer));
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<PublicQuestion> getQuestionById(@PathVariable UUID id) {
        return ResponseEntity.ok(forumService.getQuestionById(id));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable UUID id) {
        forumService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/answers/{id}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable UUID id) {
        forumService.deleteAnswer(id);
        return ResponseEntity.noContent().build();
    }



}
