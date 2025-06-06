describe("Parcurge lecția și rezolvă testul complet", () => {
  it("navighează prin lecție și verifică scorul în card", () => {
    let scorProcentual = null;

    function extrageProcent(text) {
      const match = text.match(/(\d+)\s*\/\s*(\d+)/);
      if (match) {
        const corecte = parseInt(match[1]);
        const total = parseInt(match[2]);
        return Math.round((corecte / total) * 100);
      }
      return null;
    }

    cy.visit("http://localhost:4200/login");

    cy.get('.card-front input[formControlName="username"]').type("oanalacovei");
    cy.get('.card-front input[formControlName="password"]').type("oanalacovei");
    cy.get('.card-front button[type="submit"]').click();
    cy.location("pathname", { timeout: 10000 }).should("include", "/home");

    // Navigare la lecții și deschiderea lecției 1
    cy.get('a[href="/lectii"]').click();
    cy.contains("button", "Clasa a 9-a").click();
    cy.get(".lectie-card .btn-vizualizare").first().click();
    cy.get("h1").should("contain", "1. Ce este un algoritm?");
    navigheazaPanaLaTest();

    function navigheazaPanaLaTest() {
      cy.get("body").then(($body) => {
        const testBtn = $body.find("button.start-test-button");
        if (testBtn.length > 0) {
          cy.wrap(testBtn).click();
          cy.url().should("include", "/test");
          completeazaTestPanaLaFinal();
        } else {
          cy.contains("button", "Următor ➡").click({ force: true });
          cy.wait(300);
          navigheazaPanaLaTest();
        }
      });
    }

    // Răspunsuri random și scor
    function completeazaTestPanaLaFinal() {
      function raspundeSiContinua() {
        cy.get(".question-card")
          .first()
          .within(() => {
            cy.get("input[type='radio'], input[type='checkbox']").then(
              ($inputs) => {
                if ($inputs.length > 0) {
                  const isRadio = $inputs[0].type === "radio";
                  if (isRadio) {
                    const rand = Math.floor(Math.random() * $inputs.length);
                    cy.wrap($inputs[rand]).check({ force: true });
                  } else {
                    for (let i = 0; i < $inputs.length; i++) {
                      if (Math.random() < 0.5) {
                        cy.wrap($inputs[i]).check({ force: true });
                      }
                    }
                  }
                }
              }
            );
          });

        cy.wait(300);

        cy.get("body").then(($body) => {
          const trimiteBtn = $body.find(
            "button:contains('Trimite răspunsurile'), button:contains('Trimite testul')"
          );
          if (trimiteBtn.length > 0) {
            cy.contains("button", /Trimite/).click();
            cy.contains("Scorul tău")
              .should("exist")
              .invoke("text")
              .then((text) => {
                scorProcentual = extrageProcent(text);
              });

            // Verificare scor în card
            cy.get('a[href="/lectii"]').click();
            cy.contains("button", "Clasa a 9-a").click();

            cy.get(".lectie-card")
              .first()
              .within(() => {
                cy.get(".score-text", { timeout: 5000 }).should(
                  "contain",
                  `${scorProcentual}%`
                );
              });
          } else {
            cy.contains("button", "Următoarea").click({ force: true });
            cy.wait(300);
            raspundeSiContinua();
          }
        });
      }

      raspundeSiContinua();
    }
  });
});
