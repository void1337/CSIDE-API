const assert = require('assert');
const request = require('supertest');
const mongoose = ('mongoose');
const server = require('../../index')
var Author = require('../../models/Publisher')
// const testHelper = require('../test_helper')

// testHelper.resetTestDB();

describe("publisher Controller Tests", () => {
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
                            .post("/api/publishers")
                            .set('x-access-token', login.body.token)
                            .expect(201)
                            .send({ name: "test", country: "USA", city: "new york", address: "11 test",  email: "test@test.de", phone: "86568" })
                            .end(() => {
                                Publisher.findOne({ "name": "test" })
                                    .then(pub => {
                                        assert(pub.name === "test")
                                        assert(pub.country === "USA")
                                        done();
                                    })
                            })
                    })
            });
    })

    it('Put to /api/publishers edits an pub;isher', done => {
        request(server)
            .post('/api/login')
            .expect(200)
            .send({username: "DefaultTestUser", password: "12345"})
            .then((login) => {  
                Publisher.findOne({ "name": "test" })
                    .then(pub => {
                        request(server)
                            .put('/api/publishers')
                            .set('x-access-token', login.body.token)
                            .expect(200)
                            .send({id: pub._id, country: "germany" })
                            .end(() => {
                                Publisher.findOne({ "_id": pub._id })
                                    .then(pub2 => {
                                        assert(pub2.country === "germany")
                                        done();
                                    })
                            })
                    })
                })
    });

    it('Get to /api/publishers/:id can get publisher', done => {
        Publisher.findOne({ "name": "test" })
            .then(pub => {
                request(server)
                    .get('/api/publishers?id='+pub._id)
                    .expect(200)
                    .send()
                    .then((result) => {
                        assert(result.body.name === "test")
                        assert(result.body.country === "germany")
                        done()
                    })
        })
    })
    it('Get to /api/publishers can get publishers', done => {
        request(server)
            .get('/api/publishers')
            .expect(200)
            .send()
            .then((result) => {
                assert.notEqual(result.body.count, 0);
                done()
            })
    })

    it('Delete to /api/publishers?id= can delete publisher', done => {
        request(server)
            .post('/api/login')
            .expect(200)
            .send({username: "DefaultTestUser", password: "12345"})
            .then((login) => { 
                Publisher.findOne({ "name": "test" })
                    .then(pub => { 
                        request(server)
                            .delete('/api/publishers?id='+ pub._id)
                            .set('x-access-token', login.body.token)
                            .expect(200)
                            .send()
                            .end(() => {
                                Publisher.findOne({ name: "test" })
                                    .then((art) => {
                                        assert(art == null)
                                        done();
                                    })
                            })
                    })
            })
    })
})
