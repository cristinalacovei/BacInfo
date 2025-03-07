package e_learning_app.controller;

import e_learning_app.util.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestEmailController {


    private final EmailService emailService;

    public TestEmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail() {
        // Setează adresa de destinație (poți folosi adresa ta de email pentru test)
        emailService.sendEmail("lacoveicristina03@gmail.com", "Test Email", "Acesta este un test pentru configurarea SMTP.");
        return ResponseEntity.ok("Email trimis, verifică căsuța de email!");
    }
}