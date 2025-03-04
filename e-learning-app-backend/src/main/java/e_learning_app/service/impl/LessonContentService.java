package e_learning_app.service.impl;

import e_learning_app.model.LessonContent;
import e_learning_app.repository.LessonContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LessonContentService {
    private final LessonContentRepository lessonContentRepository;

    public LessonContentService(LessonContentRepository lessonContentRepository) {
        this.lessonContentRepository = lessonContentRepository;
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
}
