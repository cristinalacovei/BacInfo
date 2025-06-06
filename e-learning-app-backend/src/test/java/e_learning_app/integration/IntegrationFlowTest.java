package e_learning_app.integration;

import e_learning_app.model.*;
import e_learning_app.repository.*;
import e_learning_app.util.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IntegrationFlowTest {

    @LocalServerPort
    int port;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void fullFlowTest() {
        // 1. Creează o lecție
        Lesson lesson = Lesson.builder()
                .title("Flow Lesson")
                .description("Flow Description")
                .content("Aceasta este o lecție de test.")
                .classLevel(10)
                .build();

        Lesson savedLesson = lessonRepository.save(lesson);

        // 2. Creează un test asociat lecției
        TestEntity test = TestEntity.builder()
                .classLevel(10)
                .lesson(savedLesson)
                .build();

        TestEntity savedTest = testRepository.save(test);

        // 3. Creează o întrebare asociată testului
        Question question = Question.builder()
                .questionText("What is JVM?")
                .questionType("SINGLE_CHOICE")
                .test(savedTest)
                .build();

        Question savedQuestion = questionRepository.save(question);

        // 4. Creează 2 răspunsuri, unul corect, unul greșit
        Answer correct = Answer.builder()
                .answerText("Java Virtual Machine")
                .isCorrect(true)
                .question(savedQuestion)
                .build();

        Answer incorrect = Answer.builder()
                .answerText("Java Version Manager")
                .isCorrect(false)
                .question(savedQuestion)
                .build();

        Answer savedCorrect = answerRepository.save(correct);
        answerRepository.save(incorrect);

        // 5. Trimite selecția spre validare și verifică scorul
        webTestClient.post()
                .uri("/api/answers/validate-score")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(List.of(savedCorrect.getId()))
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.correctAnswers").isEqualTo(1)
                .jsonPath("$.totalQuestions").isEqualTo(1)
                .jsonPath("$.correctAnswerIds.length()").isEqualTo(1)
                .jsonPath("$.incorrectAnswerIds.length()").isEqualTo(0);

        // Cleanup
        answerRepository.deleteAll();
        questionRepository.deleteAll();
        testRepository.deleteAll();
        lessonRepository.deleteAll();
    }
}
