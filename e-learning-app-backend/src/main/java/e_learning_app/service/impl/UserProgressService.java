package e_learning_app.service.impl;

import e_learning_app.model.UserProgress;
import e_learning_app.repository.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserProgressService {
    private final UserProgressRepository userProgressRepository;

    public UserProgressService(UserProgressRepository userProgressRepository) {
        this.userProgressRepository = userProgressRepository;
    }

    public List<UserProgress> getProgressByUserId(UUID userId) {
        return userProgressRepository.findByUserId(userId);
    }

    public Optional<UserProgress> getProgressById(UUID id) {
        return userProgressRepository.findById(id);
    }

    public UserProgress saveProgress(UserProgress progress) {
        return userProgressRepository.save(progress);
    }
}
