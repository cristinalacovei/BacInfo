package e_learning_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "e_learning_app.repository")
public class ELearningAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ELearningAppApplication.class, args);
	}
}

