package e_learning_app.controller;

import e_learning_app.model.LessonContent;
import e_learning_app.service.impl.LessonContentService;
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
class LessonContentControllerTest {

    @Mock
    private LessonContentService lessonContentService;

    @InjectMocks
    private LessonContentController lessonContentController;

    private MockMvc mockMvc;
    private LessonContent lessonContent;
    private UUID contentId;
    private UUID lessonId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(lessonContentController).build();
        contentId = UUID.randomUUID();
        lessonId = UUID.randomUUID();
        lessonContent = LessonContent.builder()
                .id(contentId)
                .contentType("TEXT")
                .textContent("Introduction to OOP")
                .build();
    }

    @Test
    void testGetContentByLessonId() throws Exception {
        when(lessonContentService.getContentByLessonId(lessonId)).thenReturn(List.of(lessonContent));

        mockMvc.perform(get("/api/lesson-content/lesson/" + lessonId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].textContent").value("Introduction to OOP"));
    }
}
