/// <reference types='cypress' />
 


describe('Test with backend', ()=>{

    let tiempo = 1000;
    beforeEach(() => {
        cy.intercept({method: "Get",path: "/tags"}, {fixtures:"tags.json"})
        cy.loginToApplication();
        cy.wait(tiempo)
    })
    it.skip('verify correct request and response', ()=>{

        // cy.server();
        // cy.route("POST", '**/articles').as("postArticles")
        // cy.intercept()
        cy.intercept("POST", '**/articles').as("postArticles")
        
        cy.wait(tiempo)
        cy.get('.container > .nav > :nth-child(2) > .nav-link').should('be.visible').click({force:true})
        cy.get('body > app-root > app-editor-page > div > div > div > div > form > fieldset > fieldset:nth-child(1) > input').should('be.visible').type('this is a title8')
        cy.get('body > app-root > app-editor-page > div > div > div > div > form > fieldset > fieldset:nth-child(2) > input').should('be.visible').type('This is a description')
        cy.get('body > app-root > app-editor-page > div > div > div > div > form > fieldset > fieldset:nth-child(3) > textarea').should('be.visible').type('This is a body of the article')
        cy.get('body > app-root > app-editor-page > div > div > div > div > form > fieldset > button').should('be.visible').click({force:true})
        cy.wait(tiempo)
        
        cy.wait('@postArticles')
        cy.get("@postArticles").then (xhr => {
            console.log("xhr  ---  ")
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal("This is a body of the article")
            expect(xhr.request.body.article.description).to.equal("This is a description")
        })
        
    })
    
    it('should gave tags with routing object', ()=>{
        cy.get(".tag-list")
        .should("contain","cypress")
        .and("contain","automation")
        .and("contain","testing")
        
        
    })
    
    
    it('verify global feed likes count', ()=>{
        
        cy.intercept("POST", '**/articles/feed*', {"articles":[],"articlesCount":0})
        cy.intercept("POST", '**/articles', {fixtures:"articles.json"})
        
        // cy.loginToApplication();
        cy.contains("Global Feed").click()

    })

})