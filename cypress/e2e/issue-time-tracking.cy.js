
import IssueModal from "../pages/IssueModal";

describe('Issue time tracking', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', 'https://jira.ivorreic.com/project').then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
        });
    });

    //Creating issue for time estimation funcionality, based on TC
    it('Create issue, add estimation, edits and deletes it later', () => {
        const title = 'Madli timetracking'
        const description = 'Numbreid'

        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('.ql-editor').type(description);
            cy.get('input[name="title"]').type('x');//in some reason some of my letters where missing and i needed to "dummy" the page
            cy.get('input[name="title"]').clear().wait(500).type(title);
            cy.get('button[type="submit"]').click();
        });
        cy.get('[data-testid="board-list:backlog"]').should('be.visible').wait(3000).and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '5')
                .first()
                .find('p')
                .contains(title);
        });
        // check that there is no time in time tracker and add estimated time '10'
        cy.contains(title).click();
        cy.contains('No time logged').should('be.visible');
        cy.get('input[placeholder="Number"]').type('10')
        cy.contains('10h estimated').should('be.visible')

        //close it and assert that estimated time '10' is there
        cy.get('[data-testid="icon:close"]').click();
        cy.wait(5000)
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('10h estimated').should('be.visible');
        cy.get('[data-testid="icon:close"]').click();

        //edit estimated time to '20' and asserts it is there
        cy.wait(5000)
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.get('[placeholder="Number"]').click().clear().type(20)
        cy.get('[data-testid="icon:close"]').click();
        cy.wait(5000)
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('20h estimated').should('be.visible');
        cy.get('[data-testid="icon:close"]').click();

        //removes estimated time and assert that field is empty
        cy.wait(5000)
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.get('[placeholder="Number"]').click().clear();
        cy.get('[data-testid="icon:close"]').click();
        cy.wait(5000)
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('No time logged').should('be.visible');

    });

    //Creating test for Log time TC
    it('Create issue, add estimation, add timelogg edit', () => {
        const title = 'Madli timetracking'
        const description = 'Numbreid'

        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('.ql-editor').type(description);
            cy.get('input[name="title"]').type('x');//in some reason some of my letters where missing and i needed to "dummy" the page
            cy.get('input[name="title"]').clear().wait(500).type(title);
            cy.get('button[type="submit"]').click();
        });

        cy.get('[data-testid="board-list:backlog"]').should('be.visible').wait(5000).and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '5')
                .first()
                .find('p')
                .contains(title);
        });
        //add estimated time, close it and add 
        cy.contains(title).click();
        cy.contains('No time logged').should('be.visible');
        cy.get('input[placeholder="Number"]').type('10')
        cy.contains('10h estimated').should('be.visible')

        //close it and assert that estimated time '10' is there
        cy.get('[data-testid="icon:close"]').click();
        cy.wait(5000)
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.contains('10h estimated').should('be.visible');

        //add value to "time tracking"
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('input[placeholder="Number"]').eq(1).click().type('2')
        cy.get('input[placeholder="Number"]').eq(2).click().type('5')
        cy.get('button').contains('Done').click();
        cy.get('[data-testid="icon:close"]').click();
        cy.wait(5000)

        //assert that the "No Time Logged” label is not visible, '2h logged' and '5h logged' are visible
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.wait(5000)
        cy.contains('No time logged').should('not.exist')
        cy.contains('2h logged').should('be.visible')
        cy.contains('5h remaining').should('be.visible')
    });

    //Creating test for remove logged time TC
    it('Create issue, add timelog and remove it', () => {
        const title = 'Madli timetracking'
        const description = 'Numbreid'

        cy.get('[data-testid="modal:issue-create"]').within(() => {
            cy.get('.ql-editor').type(description);
            cy.get('input[name="title"]').type('x');//in some reason some of my letters where missing and i needed to "dummy" the page
            cy.get('input[name="title"]').clear().wait(500).type(title);
            cy.get('button[type="submit"]').click();
        });

        cy.get('[data-testid="board-list:backlog"]').should('be.visible').wait(6000).and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '5')
                .first()
                .find('p')
                .contains(title);
        });

        //Add time to timelog and remove it
        cy.contains(title).click();
        cy.contains('No time logged').should('be.visible');
        cy.get('input[placeholder="Number"]').type('10')
        cy.contains('10h estimated').should('be.visible')
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('input[placeholder="Number"]').eq(1).click().type('2')
        cy.get('input[placeholder="Number"]').eq(2).click().type('5')
        cy.get('button').contains('Done').click();
        cy.get('[data-testid="icon:close"]').click();
        cy.wait(5000)
        cy.get('[data-testid="list-issue"]').contains(title).click();
        cy.wait(5000)
        cy.contains('No time logged').should('not.exist')
        cy.contains('2h logged').should('be.visible')
        cy.contains('5h remaining').should('be.visible')

        //remove timelog
        cy.get('[data-testid="icon:stopwatch"]').click()
        cy.get('input[placeholder="Number"]').eq(1).click().clear()
        cy.get('input[placeholder="Number"]').eq(2).click().clear()
        cy.get('button').contains('Done').click();
        cy.get('[data-testid="icon:close"]').click();
        cy.wait(5000)

        //assert that there is no logged time and only estimated value
        cy.contains(title).click();
        cy.contains('No time logged').should('be.visible');
        cy.contains('10h estimated').should('be.visible');


    });

});


