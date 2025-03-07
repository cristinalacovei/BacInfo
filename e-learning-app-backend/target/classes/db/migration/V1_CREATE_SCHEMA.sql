
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Tabelul pentru lecții
CREATE TABLE lesson (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        title VARCHAR(255) NOT NULL,
                        description TEXT,
                        class_level INT CHECK (class_level BETWEEN 9 AND 12) NOT NULL,
                        test_id UUID UNIQUE,
                        FOREIGN KEY (test_id) REFERENCES test(id) ON DELETE SET NULL
);

-- Tabelul pentru conținutul lecțiilor
CREATE TABLE lesson_content (
                                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                lesson_id UUID NOT NULL,
                                content_type VARCHAR(20) CHECK (content_type IN ('TEXT', 'IMAGE', 'VIDEO', 'SCHEME')) NOT NULL,
                                content_url TEXT,
                                text_content TEXT,
                                FOREIGN KEY (lesson_id) REFERENCES lesson(id) ON DELETE CASCADE
);


-- Tabelul pentru întrebările din teste
CREATE TABLE question (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          test_id UUID NOT NULL,
                          question_text TEXT NOT NULL,
                          question_type VARCHAR(20) CHECK (question_type IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE')) NOT NULL,
                          FOREIGN KEY (test_id) REFERENCES test(id) ON DELETE CASCADE
);

-- Tabelul pentru răspunsurile întrebărilor
CREATE TABLE answer (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        question_id UUID NOT NULL,
                        answer_text TEXT NOT NULL,
                        is_correct BOOLEAN NOT NULL,
                        FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

-- Tabelul pentru răspunsurile utilizatorilor
CREATE TABLE user_answers (
                              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              user_id UUID NOT NULL,
                              question_id UUID NOT NULL,
                              selected_answer_id UUID NOT NULL,
                              FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
                              FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE,
                              FOREIGN KEY (selected_answer_id) REFERENCES answer(id) ON DELETE CASCADE
);

-- Tabelul pentru progresul utilizatorilor
CREATE TABLE user_progress (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               user_id UUID NOT NULL,
                               lesson_id UUID,
                               test_id UUID,
                               score INT,
                               completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
                               FOREIGN KEY (lesson_id) REFERENCES lesson(id) ON DELETE CASCADE,
                               FOREIGN KEY (test_id) REFERENCES test(id) ON DELETE CASCADE
);

-- Crearea indexurilor pentru performanță
CREATE INDEX idx_user_email ON "user"(email_address);
CREATE INDEX idx_lesson_class ON lesson(class_level);
CREATE INDEX idx_question_test ON question(test_id);
CREATE INDEX idx_answer_question ON answer(question_id);
CREATE INDEX idx_user_progress ON user_progress(user_id);


INSERT INTO lesson (id, title, description, class_level) VALUES
    (uuid_generate_v4(), 'Elemente de bază ale limbajului', 'Introducere în sintaxa și structura unui limbaj de programare.', 9);

INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT', 'Limbajele de programare sunt utilizate pentru a da instrucțiuni unui computer. Exemple: C++, Java, Python.');

INSERT INTO lesson_content (id, lesson_id, content_type, content_url) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'VIDEO', 'https://www.youtube.com/watch?v=intro-to-programming');

INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT',
     'Tipurile de date definesc ce fel de informație poate fi stocată. Exemple: int, float, char, string, bool.');

INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT',
     'Exemplu în C++:
      int numar = 10;
      float pi = 3.14;
      char litera = ''A'';
      bool adevarat = true;');

INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT',
     'Operatorii sunt simboluri care efectuează operații asupra variabilelor. Exemple:
      - Operatorii aritmetici: +, -, *, /
      - Operatorii de comparație: ==, !=, <, >
      - Operatorii logici: &&, ||, !');

INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT',
     'Exemplu în JavaScript:
      let suma = 10 + 5 * 2; // 20
      let comparatie = (10 > 5) && (5 == 5); // true');

INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT',
     'Structurile de control permit luarea deciziilor și repetarea instrucțiunilor. Exemple:
      - if (conditie) { ... } else { ... }
      - for (initializare; conditie; incrementare) { ... }
      - while (conditie) { ... }');

INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT',
     'Exemplu în Python:
      numar = 10
      if numar > 5:
          print("Numărul este mai mare ca 5")
      else:
          print("Numărul este mai mic sau egal cu 5")');


INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT',
     'O funcție este un bloc de cod reutilizabil. Exemple:
      - Funcții fără parametri: void salut() { printf("Hello!"); }
      - Funcții cu parametri: int suma(int a, int b) { return a + b; }');

INSERT INTO lesson_content (id, lesson_id, content_type, text_content) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 'TEXT',
     'Exemplu în C++:
      int aduna(int a, int b) {
          return a + b;
      }
      int rezultat = aduna(3, 7); // rezultat = 10');

INSERT INTO test (id, lesson_id, class_level) VALUES
    (uuid_generate_v4(), (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului'), 9);

INSERT INTO question (id, test_id, question_text, question_type) VALUES
    (uuid_generate_v4(), (SELECT id FROM test WHERE lesson_id = (SELECT id FROM lesson WHERE title = 'Elemente de bază ale limbajului')), 'Ce este o variabilă?', 'SINGLE_CHOICE');

INSERT INTO answer (id, question_id, answer_text, is_correct) VALUES
    (uuid_generate_v4(), (SELECT id FROM question WHERE question_text = 'Ce este o variabilă?'), 'Un spațiu de memorie cu un nume asociat', true);

INSERT INTO answer (id, question_id, answer_text, is_correct) VALUES
    (uuid_generate_v4(), (SELECT id FROM question WHERE question_text = 'Ce este o variabilă?'), 'Un operator matematic', false);
