package e_learning_app.controller;

import e_learning_app.model.Lesson;
import e_learning_app.model.NotificareEntity;
import e_learning_app.model.TestEntity;
import e_learning_app.service.UserService;
import e_learning_app.service.impl.LessonService;
import e_learning_app.service.impl.NotificareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    private final LessonService lessonService;
    private final NotificareService notificareService;
    private final UserService userService;

    public LessonController(LessonService lessonService, NotificareService notificareService,
                            UserService userService) {
        this.lessonService = lessonService;
        this.notificareService = notificareService;
        this.userService = userService;
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @GetMapping
    public ResponseEntity<List<Lesson>> getAllLessons() {
        return ResponseEntity.ok(lessonService.getAllLessons());
    }

    @GetMapping("/class/{classLevel}")
    public ResponseEntity<List<Lesson>> getLessonsByClassLevel(@PathVariable int classLevel) {
        return ResponseEntity.ok(lessonService.getLessonsByClassLevel(classLevel));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable UUID id) {
        Optional<Lesson> lesson = lessonService.getLessonById(id);
        return lesson.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        Lesson created = lessonService.createLesson(lesson);

        List<UUID> totiUserii = userService.getAllUserIds();
        for (UUID userId : totiUserii) {
            NotificareEntity entity = notificareService.creeazaNotificare(
                    "A fost adăugată o lecție nouă: " + created.getTitle(),
                    "LECTIE",
                    userId,
                    created.getId()
            );
            messagingTemplate.convertAndSend("/topic/notificari", entity);
        }
        return ResponseEntity.ok(created);
    }



    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable UUID id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Lesson> updateLesson(@PathVariable UUID id, @RequestBody Lesson updatedLesson) {
        Optional<Lesson> updated = lessonService.updateLesson(id, updatedLesson);

        List<UUID> totiUserii = userService.getAllUserIds();
        for (UUID userId : totiUserii) {
            updated.ifPresent(lesson -> {
                NotificareEntity entity = notificareService.creeazaNotificare(
                        "Lecția \"" + lesson.getTitle() + "\" a fost modificată.",
                        "LECTIE",
                        userId,
                        lesson.getId()

                );
                messagingTemplate.convertAndSend("/topic/notificari", entity);
            });
        }
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }



    @GetMapping("/{lessonId}/test")
    public ResponseEntity<TestEntity> getTestForLesson(@PathVariable UUID lessonId) {
        return lessonService.getTestByLessonId(lessonId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }



}
