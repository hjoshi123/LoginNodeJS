'use strict'

let mongoose = require('mongoose'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    app = require('../app'),
    should = chai.should();

chai.use(chaiHttp);

/**
 * test case for login it should return 200 
 * Ideally can be done in a different db but for now it's fine 
 * :p
 */
describe('/POST login', () => {
    it('it should login', (done) => {
        let user = {
            email : 'hemantjoshi6@icloud.com',
            password : 'hjoshi'
        }
        chai.request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
    it('it shouldnot login', (done) => {
        let user = {
            email : 'hemantjoshi6@icloud.com',
            password : 'hhgdsgjs'
        }
        chai.request(app)
        .post('/login')
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});