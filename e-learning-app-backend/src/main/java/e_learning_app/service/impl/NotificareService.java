package e_learning_app.service.impl;

import e_learning_app.model.NotificareEntity;
import e_learning_app.repository.NotificareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificareService {

    private final NotificareRepository repo;

    public NotificareEntity creeazaNotificare(String mesaj, String tip, UUID userId, UUID targetId) {
        return repo.save(
                NotificareEntity.builder()
                        .mesaj(mesaj)
                        .tip(tip)
                        .userId(userId)
                        .targetId(targetId)
                        .timestamp(new Date())
                        .citita(false)
                        .build()
        );
    }

    public NotificareEntity creeazaNotificare(String mesaj, String tip, UUID userId) {
        return creeazaNotificare(mesaj, tip, userId, null);
    }


    public List<NotificareEntity> notificariNecitite(UUID userId) {
        return repo.findByUserIdAndCititaFalse(userId);
    }

    public List<NotificareEntity> notificariPentruUtilizator(UUID userId) {
        Date sapteZileInUrma = new Date(System.currentTimeMillis() - 7L * 24 * 60 * 60 * 1000);
        return repo.findByUserIdAndTimestampAfter(userId, sapteZileInUrma);
    }


    public void marcheazaCaCitita(UUID  notificareId) {
        repo.findById(notificareId).ifPresent(n -> {
            n.setCitita(true);
            repo.save(n);
        });
    }

    public void marcheazaToateCaCitite(UUID userId) {
        List<NotificareEntity> notificari = repo.findByUserIdAndCititaFalse(userId);
        for (NotificareEntity n : notificari) {
            n.setCitita(true);
        }
        repo.saveAll(notificari);
    }

}
