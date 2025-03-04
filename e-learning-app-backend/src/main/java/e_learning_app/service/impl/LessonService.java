package e_learning_app.service.impl;
import e_learning_app.model.Lesson;
import e_learning_app.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LessonService {
    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public List<Lesson> getLessonsByClassLevel(int classLevel) {
        return lessonRepository.findByClassLevel(classLevel);
    }

    public Optional<Lesson> getLessonById(UUID id) {
        return lessonRepository.findById(id);
    }

    public Lesson createLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(UUID id) {
        lessonRepository.deleteById(id);
    }
}
