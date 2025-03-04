package e_learning_app.service;
import e_learning_app.model.LessonContent;
import e_learning_app.repository.LessonContentRepository;
import e_learning_app.service.impl.LessonContentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonContentServiceTest {

    @Mock
    private LessonContentRepository lessonContentRepository;

    @InjectMocks
    private LessonContentService lessonContentService;

    private LessonContent lessonContent;
    private UUID contentId;
    private UUID lessonId;

    @BeforeEach
    void setUp() {
        contentId = UUID.randomUUID();
        lessonId = UUID.randomUUID();
        lessonContent = LessonContent.builder()
                .id(contentId)
                .contentType("TEXT")
                .textContent("Introduction to OOP")
                .build();
    }

    @Test
    void testGetContentByLessonId() {
        when(lessonContentRepository.findByLessonId(lessonId)).thenReturn(List.of(lessonContent));

        List<LessonContent> contents = lessonContentService.getContentByLessonId(lessonId);

        assertFalse(contents.isEmpty());
        assertEquals(1, contents.size());
        assertEquals("TEXT", contents.get(0).getContentType());
    }

    @Test
    void testGetLessonContentById() {
        when(lessonContentRepository.findById(contentId)).thenReturn(Optional.of(lessonContent));

        Optional<LessonContent> foundContent = lessonContentService.getLessonContentById(contentId);

        assertTrue(foundContent.isPresent());
        assertEquals("TEXT", foundContent.get().getContentType());
    }

    @Test
    void testCreateLessonContent() {
        when(lessonContentRepository.save(any(LessonContent.class))).thenReturn(lessonContent);

        LessonContent savedContent = lessonContentService.createLessonContent(lessonContent);

        assertNotNull(savedContent);
        assertEquals("TEXT", savedContent.getContentType());
    }

    @Test
    void testDeleteLessonContent() {
        doNothing().when(lessonContentRepository).deleteById(contentId);

        lessonContentService.deleteLessonContent(contentId);

        verify(lessonContentRepository, times(1)).deleteById(contentId);
    }
}
