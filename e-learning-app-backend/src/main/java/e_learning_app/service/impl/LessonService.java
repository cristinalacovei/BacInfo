package e_learning_app.service.impl;

import e_learning_app.model.Lesson;
import e_learning_app.model.TestEntity;
import e_learning_app.repository.LessonRepository;
import e_learning_app.repository.TestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LessonService {
    private final LessonRepository lessonRepository;
    private final TestRepository testRepository;

    public LessonService(LessonRepository lessonRepository, TestRepository testRepository) {
        this.lessonRepository = lessonRepository;
        this.testRepository = testRepository;
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

    public Optional<Lesson> updateLesson(UUID id, Lesson updatedLesson) {
        return lessonRepository.findById(id).map(existingLesson -> {
            existingLesson.setTitle(updatedLesson.getTitle());
            existingLesson.setDescription(updatedLesson.getDescription());
            existingLesson.setContent(updatedLesson.getContent());
            return lessonRepository.save(existingLesson);
        });
    }
    public Optional<TestEntity> getTestByLessonId(UUID lessonId) {
        return testRepository.findByLessonId(lessonId);
    }





}
