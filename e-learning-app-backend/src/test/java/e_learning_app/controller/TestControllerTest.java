package e_learning_app.controller;

import e_learning_app.model.TestEntity;
import e_learning_app.service.impl.TestService;
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
class TestControllerTest {

    @Mock
    private TestService testService;

    @InjectMocks
    private TestController testController;

    private MockMvc mockMvc;
    private TestEntity test;
    private UUID testId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(testController).build();
        testId = UUID.randomUUID();
        test = TestEntity.builder()
                .id(testId)
                .classLevel(11)
                .build();
    }

    @Test
    void testGetAllTests() throws Exception {
        when(testService.getAllTests()).thenReturn(List.of(test));

        mockMvc.perform(get("/api/tests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].classLevel").value(11));
    }

    @Test
    void testGetTestById() throws Exception {
        when(testService.getTestById(testId)).thenReturn(Optional.of(test));

        mockMvc.perform(get("/api/tests/" + testId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.classLevel").value(11));
    }

    @Test
    void testCreateTest() throws Exception {
        when(testService.createTest(any(TestEntity.class))).thenReturn(test);

        mockMvc.perform(post("/api/tests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"classLevel\":11}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.classLevel").value(11));
    }

    @Test
    void testDeleteTest() throws Exception {
        doNothing().when(testService).deleteTest(testId);

        mockMvc.perform(delete("/api/tests/" + testId))
                .andExpect(status().isNoContent());

        verify(testService, times(1)).deleteTest(testId);
    }
}
