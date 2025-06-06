package e_learning_app.controller;

import e_learning_app.model.NotificareEntity;
import e_learning_app.model.PublicAnswer;
import e_learning_app.model.PublicQuestion;
import e_learning_app.service.UserService;
import e_learning_app.service.impl.ForumService;
import e_learning_app.service.impl.NotificareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final ForumService forumService;
    private final NotificareService notificareService;
    private final UserService userService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ForumController(
            ForumService forumService,
            NotificareService notificareService,
            UserService userService
    ) {
        this.forumService = forumService;
        this.notificareService = notificareService;
        this.userService = userService;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<PublicQuestion>> getAllQuestions() {
        return ResponseEntity.ok(forumService.getAllQuestions());
    }

    @PostMapping("/questions")
    public ResponseEntity<PublicQuestion> postQuestion(@RequestBody PublicQuestion question) {
        return ResponseEntity.ok(forumService.postQuestion(question));
    }

    @GetMapping("/questions/{id}/answers")
    public ResponseEntity<List<PublicAnswer>> getAnswers(@PathVariable UUID id) {
        return ResponseEntity.ok(forumService.getAnswersForQuestion(id));
    }

    @PostMapping("/questions/{id}/answers")
    public ResponseEntity<PublicAnswer> postAnswer(@PathVariable UUID id, @RequestBody PublicAnswer answer) {
        Optional<PublicQuestion> originalQuestionOpt = Optional.ofNullable(forumService.getQuestionById(id));

        if (originalQuestionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PublicQuestion originalQuestion = originalQuestionOpt.get();
        answer.setQuestion(originalQuestion);

        PublicAnswer savedAnswer = forumService.postAnswer(answer);

        // trimite notificare autorului întrebării
        if (originalQuestion.getAuthor() != null && originalQuestion.getAuthor().getId() != null) {
            NotificareEntity notificare = notificareService.creeazaNotificare(
                    "Ai primit un răspuns la întrebarea ta!",
                    "FORUM",
                    originalQuestion.getAuthor().getId(),
                    originalQuestion.getId()
            );
            messagingTemplate.convertAndSend("/topic/notificari", notificare);
        }

        return ResponseEntity.ok(savedAnswer);
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
