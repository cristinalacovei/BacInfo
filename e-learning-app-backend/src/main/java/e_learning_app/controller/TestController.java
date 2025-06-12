package e_learning_app.controller;

import e_learning_app.model.NotificareEntity;
import e_learning_app.model.TestEntity;
import e_learning_app.service.UserService;
import e_learning_app.service.impl.LessonService;
import e_learning_app.service.impl.NotificareService;
import e_learning_app.service.impl.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tests")
public class TestController {
    private final TestService testService;
    private final NotificareService notificareService;
    private final UserService userService;
    private final LessonService lessonService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public TestController(TestService testService, NotificareService notificareService, UserService userService, LessonService lessonService) {
        this.testService = testService;
        this.notificareService = notificareService;
        this.userService = userService;
        this.lessonService = lessonService;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestEntity> createTest(@RequestBody TestEntity test) {
        // încarcă lecția completă (cu titlu) din baza de date
        UUID lessonId = test.getLesson().getId();
        test.setLesson(lessonService.getLessonById(lessonId).orElse(null)); // asigură-te că lessonService există

        TestEntity created = testService.createTest(test);

        List<UUID> totiUserii = userService.getAllUserIds();
        for (UUID userId : totiUserii) {
            String titlu = created.getLesson() != null ? created.getLesson().getTitle() : "(necunoscut)";
            NotificareEntity notificare = notificareService.creeazaNotificare(
                    "A fost adăugat un test nou pentru lecția: " + titlu,
                    "TEST",
                    userId,
                    created.getId()
            );
            messagingTemplate.convertAndSend("/topic/notificari", notificare);
        }

        return ResponseEntity.ok(created);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTest(@PathVariable UUID id) {
        testService.deleteTest(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestEntity> updateTest(@PathVariable UUID id, @RequestBody TestEntity updatedTest) {
        return testService.updateTest(id, updatedTest)
                .map(test -> {
                    // 🔧 Asigură-te că lecția e complet populată pentru titlu
                    if (test.getLesson() != null && test.getLesson().getTitle() == null) {
                        UUID lessonId = test.getLesson().getId();
                        test.setLesson(lessonService.getLessonById(lessonId).orElse(null));
                    }

                    List<UUID> totiUserii = userService.getAllUserIds();
                    String titlu = test.getLesson() != null ? test.getLesson().getTitle() : "(necunoscut)";
                    for (UUID userId : totiUserii) {
                        NotificareEntity notificare = notificareService.creeazaNotificare(
                                "Testul pentru lecția \"" + titlu + "\" a fost actualizat.",
                                "TEST",
                                userId,
                                test.getId()
                        );
                        messagingTemplate.convertAndSend("/topic/notificari", notificare);
                    }

                    return ResponseEntity.ok(test);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/lesson-id")
    public ResponseEntity<UUID> getLessonIdByTestId(@PathVariable UUID id) {
        UUID lessonId = testService.getLessonIdByTestId(id);
        return ResponseEntity.ok(lessonId);
    }
}
