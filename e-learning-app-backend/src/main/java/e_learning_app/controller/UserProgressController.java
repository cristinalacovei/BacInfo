package e_learning_app.controller;

import e_learning_app.dto.UserProgressDTO;
import e_learning_app.model.User;
import e_learning_app.model.UserProgress;
import e_learning_app.service.impl.UserProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
public class UserProgressController {

    private final UserProgressService userProgressService;

    public UserProgressController(UserProgressService userProgressService) {
        this.userProgressService = userProgressService;
    }

    @PostMapping
    public ResponseEntity<?> saveProgress(@RequestBody UserProgressDTO dto) {
        try {
            UserProgress saved = userProgressService.saveProgress(dto);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
