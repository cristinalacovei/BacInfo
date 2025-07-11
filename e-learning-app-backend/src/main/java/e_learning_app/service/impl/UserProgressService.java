package e_learning_app.service.impl;

import e_learning_app.dto.UserProgressDTO;
import e_learning_app.model.Lesson;
import e_learning_app.model.TestEntity;
import e_learning_app.model.User;
import e_learning_app.model.UserProgress;
import e_learning_app.repository.LessonRepository;
import e_learning_app.repository.TestRepository;
import e_learning_app.repository.UserProgressRepository;
import e_learning_app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserProgressService {
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final TestRepository testRepository;
    private final LessonRepository lessonRepository;

    public UserProgressService(UserProgressRepository userProgressRepository,
                               UserRepository userRepository,
                               TestRepository testRepository,
                               LessonRepository lessonRepository) {
        this.userProgressRepository = userProgressRepository;
        this.userRepository = userRepository;
        this.testRepository = testRepository;
        this.lessonRepository = lessonRepository;
    }

    public UserProgress saveProgress(UserProgressDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        TestEntity test = testRepository.findById(dto.getTestId())
                .orElseThrow(() -> new IllegalArgumentException("Test not found"));

        Lesson lesson = null;
        if (dto.getLessonId() != null) {
            lesson = lessonRepository.findById(dto.getLessonId())
                    .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
        }

        UserProgress progress = new UserProgress();
        progress.setUser(user);
        progress.setTest(test);
        progress.setLesson(lesson);
        progress.setScore(dto.getScore());
        progress.setCompletedAt(dto.getCompletedAt());

        return userProgressRepository.save(progress);
    }

    public List<UserProgress> getProgressByUserId(UUID userId) {
        return userProgressRepository.findByUserId(userId);
    }

    public Optional<UserProgress> getProgressById(UUID id) {
        return userProgressRepository.findById(id);
    }

    public List<UserProgressDTO> getLatestProgressPerLesson(UUID userId) {
        List<UserProgress> allProgress = userProgressRepository.findByUserId(userId);


        Map<UUID, UserProgress> latestByLesson = new HashMap<>();

        for (UserProgress progress : allProgress) {
            if (progress.getLesson() == null) continue;

            UUID lessonId = progress.getLesson().getId();
            if (!latestByLesson.containsKey(lessonId) ||
                    progress.getCompletedAt().isAfter(latestByLesson.get(lessonId).getCompletedAt())) {
                latestByLesson.put(lessonId, progress);
            }
        }


        return latestByLesson.values().stream()
                .map(progress -> {
                    UserProgressDTO dto = new UserProgressDTO();
                    dto.setUserId(progress.getUser().getId());
                    dto.setLessonId(progress.getLesson().getId());
                    dto.setTestId(progress.getTest().getId());
                    dto.setScore(progress.getScore());
                    dto.setCompletedAt(progress.getCompletedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

}

