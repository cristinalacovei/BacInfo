package e_learning_app.controller;

import e_learning_app.model.Lesson;
import e_learning_app.service.impl.LessonService;
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
class LessonControllerTest {

    @Mock
    private LessonService lessonService;

    @InjectMocks
    private LessonController lessonController;

    private MockMvc mockMvc;
    private Lesson lesson;
    private UUID lessonId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(lessonController).build();
        lessonId = UUID.randomUUID();
        lesson = Lesson.builder()
                .id(lessonId)
                .title("Mock Lesson")
                .description("Mock Description")
                .classLevel(11)
                .build();
    }

    @Test
    void testGetAllLessons() throws Exception {
        when(lessonService.getAllLessons()).thenReturn(List.of(lesson));

        mockMvc.perform(get("/api/lessons"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].title").value("Mock Lesson"));
    }

    @Test
    void testGetLessonById() throws Exception {
        when(lessonService.getLessonById(lessonId)).thenReturn(Optional.of(lesson));

        mockMvc.perform(get("/api/lessons/" + lessonId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Mock Lesson"));
    }

    @Test
    void testCreateLesson() throws Exception {
        when(lessonService.createLesson(any(Lesson.class))).thenReturn(lesson);

        mockMvc.perform(post("/api/lessons")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Mock Lesson\",\"description\":\"Mock Description\",\"classLevel\":11}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Mock Lesson"));
    }

    @Test
    void testDeleteLesson() throws Exception {
        doNothing().when(lessonService).deleteLesson(lessonId);

        mockMvc.perform(delete("/api/lessons/" + lessonId))
                .andExpect(status().isNoContent());

        verify(lessonService, times(1)).deleteLesson(lessonId);
    }
}

