const assert = require('assert');
const request = require('supertest');
const server = require('../../index')
var User = require('../../models/User')
// const testHelper = require('../test_helper')

// testHelper.resetTestDB();

describe('User controller tests', () => {
    it('Post to api/users creates a new user', (done) => {
        request(server)
            .post('/api/users/')
            .send({
                username: "Tester",
                password: "123",
                name: "joran hompesch",
                country: "deutschland"
            })
            .expect(201)
            .end(() => {
                User.findOne({ username: "Tester" })
                    .then(user => {
                    assert(user.username === "Tester");
                    done()
                });
            });
    });
    it('Login with created User Put to /api/users/:username edits an existing User password', done => {
        request(server)
            .post('/api/login')
            .send({username: "Tester", password: "123"})
            .then((result) => {
                request(server)
                    .put('/api/users/')
                    .set('x-access-token', result.body.token)
                    .expect(200)
                    .send({password: "123", newPassword: "abcd" })
                    .end(() => {
                        User.findOne({ username: "Tester" })
                            .then(user => {
                                assert(user.password === "abcd")
                                done();
                            })
                    })
            });
    });

    it('Login with created User Put to /api/users/:username edits an existing User details ', done => {
        request(server)
            .post('/api/login')
            .send({username: "Tester", password: "abcd"})
            .then((result) => {
                request(server)
                    .put('/api/users/')
                    .set('x-access-token', result.body.token)
                    .expect(200)
                    .send({name: "jan steen", country: "nederland" })
                    .end(() => {
                        User.findOne({ username: "Tester" })
                            .then(user => {
                                assert(user.name === "jan steen")
                                assert(user.country === "nederland")
                                done();
                            })
                    })
            });
    });

    it('Login with created User Delete to /api/users/username can delete user', done => {
        request(server)
            .post('/api/login')
            .send({username: "Tester", password: "abcd"})
            .then((result) => {
                request(server)
                .delete('/api/users/')
                .set('x-access-token', result.body.token)
                .expect(200)
                .send({userId: result.userId, password: "abcd" })
                .end(() => {
                    User.findOne({ username: "Tester" })
                        .then((user) => {
                            console.log(user)
                            assert(user === null)
                            done();
                        });
                });
            });
        });
});