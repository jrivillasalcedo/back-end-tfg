const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const usersController = require('../users.controller');

const app = require('../../app').app;

beforeEach(async () => {
    await usersController.registerUser('admin','bettatech','bettatech@mail.com', '1234', '67458365T');
    await usersController.registerUser('teacher','mastermind','mastermind@mail.com', '4321', '67458365T');
})

afterEach(async () => {
    await usersController.cleanUpUsers();
});

describe('Suite de pruebas auth', () => {

    it('should return 400 when no data is provided', (done) => {
        chai.request(app)
            .post('/auth/login')
            .end((err, res) => {
                //Expect valid login
                chai.assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('should return 200 and token for succesful login', (done) => {
        chai.request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({mail: 'bettatech@mail.com', password: '1234'})
            .end((err, res) => {
                //Expect valid login
                chai.assert.equal(res.statusCode, 200);
                done();
            });
    });

    it('should return 200 for a succesful register', (done) => {
        chai.request(app)
            .post('/auth/register')
            .set('content-type', 'application/json')
            .send({userRole: 'admin', userName:'testName', mail: 'userTest@mail.com', password: '1234', idNumber: '02721083E'})
            .end((err, res) => {
                //Expect valid login
                chai.assert.equal(res.statusCode, 200);
                done();
            });
    });

    it('should return 400 for a empty register', (done) => {
        chai.request(app)
            .post('/auth/register')
            .set('content-type', 'application/json')
            .send({})
            .end((err, res) => {
                //Expect valid login
                chai.assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('should return 400 for a empty register field', (done) => {
        chai.request(app)
            .post('/auth/register')
            .set('content-type', 'application/json')
            .send({userRole: 'admin', userName:'testName', password: '1234', idNumber: '02721083E'})
            .end((err, res) => {
                //Expect valid login
                chai.assert.equal(res.statusCode, 400);
                done();
            });
    });
});
