const assert = require('assert');
const request = require('supertest');
const mongoose = ('mongoose');
const server = require('../../index')
var Author = require('../../models/Author')
// const testHelper = require('../test_helper')

// testHelper.resetTestDB();

describe("Author Controller Tests", () => {
    it("Controller creates Author", (done) => {
        request(server)
            .post('/api/users/')
            .send({
                username: "DefaultTestUser",
                password: "12345",
                name: "Jöran Hompesch",
                country: "Netherlands"
            })


            .expect(201)
            .then((result) => {
                request(server)
                    .post('/api/login')
                    .expect(200)
                    .send({username: "DefaultTestUser", password: "12345"})
                    .then((login) => {
                        request(server)
                            .post("/api/authors")
                            .set('x-access-token', login.body.token)
                            .expect(201)
                            .send({ name: "Frank Herbert", country: "USA", bio: "Frank Herbert was een Amerikaans sciencefictionschrijver. Hij schreef een twintigtal romans en een veertigtal verhalen, maar is voornamelijk bekend van zijn zesdelige epos Dune.", birthyear: "1920",  img: "https://sublime.nl/wp-content/uploads/2016/11/b6ce039648d6d381fbd4321aa338bf17.jpg" })
                            .end(() => {
                                Author.findOne({ "name": "Frank Herbert" })
                                    .then(author => {
                                        assert(author.name === "Frank Herbert")
                                        assert(author.country === "USA")
                                        done();
                                    })
                            })
                    })
            });
    })

    it('Put to /api/authors edits an Author', done => {
        request(server)
            .post('/api/login')
            .expect(200)
            .send({username: "DefaultTestUser", password: "12345"})
            .then((login) => {  
                Author.findOne({ "name": "Frank Herbert" })
                    .then(author => {
                        request(server)
                            .put('/api/authors')
                            .set('x-access-token', login.body.token)
                            .expect(200)
                            .send({id: author._id, country: "germany" })
                            .end(() => {
                                Author.findOne({ "_id": author._id })
                                    .then(author => {
                                        assert(author.country === "germany")
                                        done();
                                    })
                            })
                    })
                })
    });

    it('Get to /api/authors/:id can get author', done => {
        Author.findOne({ "name": "Frank Herbert" })
            .then(author => {
                request(server)
                    .get('/api/authors?id='+author._id)
                    .expect(200)
                    .send()
                    .then((result) => {
                        assert(result.body.name === "Frank Herbert")
                        assert(result.body.country === "germany")
                        done()
                    })
        })
    })
    it('Get to /api/authors can get authors', done => {
        request(server)
            .get('/api/authors')
            .expect(200)
            .send()
            .then((result) => {
                assert.notEqual(result.body.count, 0);
                done()
            })
    })

    it('Delete to /api/authors?id= can delete author', done => {
        request(server)
            .post('/api/login')
            .expect(200)
            .send({username: "DefaultTestUser", password: "12345"})
            .then((login) => { 
                Author.findOne({ "name": "Frank Herbert" })
                    .then(author => { 
                        request(server)
                            .delete('/api/authors?id='+ author._id)
                            .set('x-access-token', login.body.token)
                            .expect(200)
                            .send()
                            .end(() => {
                                Author.findOne({ name: "Frank Herbert" })
                                    .then((art) => {
                                        assert(art == null)
                                        done();
                                    })
                            })
                    })
            })
    })
})
