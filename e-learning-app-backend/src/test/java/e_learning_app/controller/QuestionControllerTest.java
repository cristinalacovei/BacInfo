package e_learning_app.controller;

import e_learning_app.model.Question;
import e_learning_app.service.impl.QuestionService;
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
class QuestionControllerTest {

    @Mock
    private QuestionService questionService;

    @InjectMocks
    private QuestionController questionController;

    private MockMvc mockMvc;
    private Question question;
    private UUID questionId;
    private UUID testId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(questionController).build();
        questionId = UUID.randomUUID();
        testId = UUID.randomUUID();
        question = Question.builder()
                .id(questionId)
                .questionText("What is Java?")
                .questionType("SINGLE_CHOICE")
                .build();
    }

    @Test
    void testGetQuestionsByTestId() throws Exception {
        when(questionService.getQuestionsByTestId(testId)).thenReturn(List.of(question));

        mockMvc.perform(get("/api/questions/test/" + testId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].questionText").value("What is Java?"));
    }

    @Test
    void testGetQuestionById() throws Exception {
        when(questionService.getQuestionById(questionId)).thenReturn(Optional.of(question));

        mockMvc.perform(get("/api/questions/" + questionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionText").value("What is Java?"));
    }

    @Test
    void testCreateQuestion() throws Exception {
        when(questionService.createQuestion(any(Question.class))).thenReturn(question);

        mockMvc.perform(post("/api/questions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"questionText\":\"What is Java?\",\"questionType\":\"SINGLE_CHOICE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.questionText").value("What is Java?"));
    }

    @Test
    void testDeleteQuestion() throws Exception {
        doNothing().when(questionService).deleteQuestion(questionId);

        mockMvc.perform(delete("/api/questions/" + questionId))
                .andExpect(status().isNoContent());

        verify(questionService, times(1)).deleteQuestion(questionId);
    }

    @Test
    void testGetQuestionById_NotFound() throws Exception {
        when(questionService.getQuestionById(questionId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/questions/" + questionId))
                .andExpect(status().isNotFound());
    }

}
