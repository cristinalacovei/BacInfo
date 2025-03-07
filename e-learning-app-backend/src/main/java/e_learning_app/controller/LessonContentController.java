package e_learning_app.controller;

import e_learning_app.model.LessonContent;
import e_learning_app.service.impl.LessonContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/lesson-content")
public class LessonContentController {
    private final LessonContentService lessonContentService;

    public LessonContentController(LessonContentService lessonContentService) {
        this.lessonContentService = lessonContentService;
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<LessonContent>> getContentByLessonId(@PathVariable UUID lessonId) {
        return ResponseEntity.ok(lessonContentService.getContentByLessonId(lessonId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonContent> getLessonContentById(@PathVariable UUID id) {
        Optional<LessonContent> lessonContent = lessonContentService.getLessonContentById(id);
        return lessonContent.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LessonContent> createLessonContent(@RequestBody LessonContent lessonContent) {
        return ResponseEntity.ok(lessonContentService.createLessonContent(lessonContent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLessonContent(@PathVariable UUID id) {
        lessonContentService.deleteLessonContent(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/lesson/{lessonId}")
    public ResponseEntity<Void> updateLessonContent(@PathVariable UUID lessonId, @RequestBody List<LessonContent> contents) {
        lessonContentService.updateLessonContents(lessonId, contents);
        return ResponseEntity.ok().build();
    }

}

