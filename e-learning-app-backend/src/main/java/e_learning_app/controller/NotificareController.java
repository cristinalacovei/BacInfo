package e_learning_app.controller;

import e_learning_app.model.NotificareEntity;
import e_learning_app.service.impl.NotificareService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notificari")
@RequiredArgsConstructor
public class  NotificareController {

    private final NotificareService service;

    @GetMapping("/necitite/{userId}")
    public List<NotificareEntity> getNecitite(@PathVariable UUID userId) {
        return service.notificariNecitite(userId);
    }

    @GetMapping("/toate/{userId}")
    public List<NotificareEntity> getToate(@PathVariable UUID  userId) {
        return service.notificariPentruUtilizator(userId);
    }


    @PostMapping("/citita/{id}")
    public void marcheazaCaCitita(@PathVariable UUID  id) {
        service.marcheazaCaCitita(id);
    }
    @PostMapping("/citeste-tot/{userId}")
    public void marcheazaToateCaCitite(@PathVariable UUID userId) {
        service.marcheazaToateCaCitite(userId);
    }

    @DeleteMapping("/{id}")
    public void stergeNotificare(@PathVariable UUID id) {
        service.stergeNotificare(id);
    }

    @DeleteMapping("/toate/{userId}")
    public void stergeToate(@PathVariable UUID userId) {
        service.stergeToatePentruUtilizator(userId);
    }

}

