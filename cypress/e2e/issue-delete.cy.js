describe('Issue details editing', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
        cy.get('[data-testid="modal:issue-details"]', { timeout: 10000 }).should('be.visible');


      });
    });
    //Test1:
    it('Should delete first issue from the board', () => {
        //Click on the delete button and confirm it
        cy.get('[data-testid="icon:trash"]').click();
        //Confirmation dialouge appears, then confirm the deletion
        cy.contains('Are you sure you want to delete this issue?').should('be.visible');
        cy.get('button').contains('Delete issue').click();
        cy.wait(2000); 

        //Assert that deletion confirmation dialouge is not visible
        cy.contains('Are you sure you want to delete this issue?').should('not.exist');

        //Assert, that issue is deleted and not displayed on the Jira board anymore.
        cy.wait(15000); 
        cy.contains('This is an issue of type: Task.').should('not.exist'); 
      });

    //Test2: 
    it('Should delete first issue from the board', () => {
        //Click on the delete button 
        cy.get('[data-testid="icon:trash"]').click();
        //Confirmation dialouge appears
        cy.contains('Are you sure you want to delete this issue?').should('be.visible');
        //Click on Cancel button what is located on pop-up
        cy.get('button').contains('Cancel').click();
        cy.wait(2000); 

        // Click on "X" button to navigate back to the Jira board using document.querySelector()
        cy.window().then((win) => {
            win.document.querySelector('[data-testid="icon:close"]').click();
          });

        //Assert that deletion confirmation dialouge is not visible
        cy.contains('Are you sure you want to delete this issue?').should('not.exist');
        //Assert, that issue is not deleted and is located on Jira board.
        cy.contains('This is an issue of type: Task.').should('exist'); 
      });


    });
