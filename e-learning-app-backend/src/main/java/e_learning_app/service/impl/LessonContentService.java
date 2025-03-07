package e_learning_app.service.impl;

import e_learning_app.model.LessonContent;
import e_learning_app.repository.LessonContentRepository;
import e_learning_app.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LessonContentService {
    private final LessonContentRepository lessonContentRepository;
    private final LessonRepository lessonRepository;

    public LessonContentService(LessonContentRepository lessonContentRepository, LessonRepository lessonRepository) {
        this.lessonContentRepository = lessonContentRepository;
        this.lessonRepository = lessonRepository;
    }

    public List<LessonContent> getContentByLessonId(UUID lessonId) {
        return lessonContentRepository.findByLessonId(lessonId);
    }

    public Optional<LessonContent> getLessonContentById(UUID id) {
        return lessonContentRepository.findById(id);
    }

    public LessonContent createLessonContent(LessonContent lessonContent) {
        return lessonContentRepository.save(lessonContent);
    }

    public void deleteLessonContent(UUID id) {
        lessonContentRepository.deleteById(id);
    }

    public void updateLessonContents(UUID lessonId, List<LessonContent> contents) {
        List<LessonContent> existingContents = lessonContentRepository.findByLessonId(lessonId);
        lessonContentRepository.deleteAll(existingContents);
        for (LessonContent content : contents) {
            content.setLesson(lessonRepository.findById(lessonId).orElseThrow());
            lessonContentRepository.save(content);
        }
    }

}
