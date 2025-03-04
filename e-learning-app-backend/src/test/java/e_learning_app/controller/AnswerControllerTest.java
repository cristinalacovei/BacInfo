package e_learning_app.controller;

import e_learning_app.model.Answer;
import e_learning_app.service.impl.AnswerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AnswerControllerTest {

    @Mock
    private AnswerService answerService;

    @InjectMocks
    private AnswerController answerController;

    private MockMvc mockMvc;
    private Answer answer;
    private UUID answerId;
    private UUID questionId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(answerController).build();
        answerId = UUID.randomUUID();
        questionId = UUID.randomUUID();
        answer = Answer.builder()
                .id(answerId)
                .answerText("Encapsulation")
                .isCorrect(true)
                .build();
    }

    @Test
    void testGetAnswersByQuestionId() throws Exception {
        when(answerService.getAnswersByQuestionId(questionId)).thenReturn(List.of(answer));

        mockMvc.perform(get("/api/answers/question/" + questionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].answerText").value("Encapsulation"));
    }

    @Test
    void testGetAnswerById() throws Exception {
        when(answerService.getAnswerById(answerId)).thenReturn(Optional.of(answer));

        mockMvc.perform(get("/api/answers/" + answerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answerText").value("Encapsulation"));
    }

    @Test
    void testCreateAnswer() throws Exception {
        when(answerService.createAnswer(any(Answer.class))).thenReturn(answer);

        mockMvc.perform(post("/api/answers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"answerText\":\"Encapsulation\",\"isCorrect\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answerText").value("Encapsulation"));
    }

    @Test
    void testDeleteAnswer() throws Exception {
        doNothing().when(answerService).deleteAnswer(answerId);

        mockMvc.perform(delete("/api/answers/" + answerId))
                .andExpect(status().isNoContent());

        verify(answerService, times(1)).deleteAnswer(answerId);
    }
}

