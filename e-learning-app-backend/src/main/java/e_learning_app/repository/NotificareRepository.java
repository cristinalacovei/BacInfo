package e_learning_app.repository;

import e_learning_app.model.NotificareEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface NotificareRepository extends JpaRepository<NotificareEntity, UUID> {
    List<NotificareEntity> findByUserIdAndCititaFalse(UUID userId);
    List<NotificareEntity> findByUserIdAndTimestampAfter(UUID userId, Date after);
    List<NotificareEntity> findByUserId(UUID userId);

}

