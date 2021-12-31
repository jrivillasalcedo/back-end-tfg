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

    it('should return 200 and the user with the user id in token', (done) => {
        chai.request(app)
            .post('/auth/register')
            .set('content-type', 'application/json')
            .send({userRole: 'admin', userName:'testName', mail: 'userTest@mail.com', password: '1234', idNumber: '02721083E'})
            .end((err, res) => {
                chai.request(app)
                    .post('/auth/login')
                    .set('content-type', 'application/json')
                    .send({mail: 'userTest@mail.com', password: '1234'})
                    .end((err, res) => {
                        let token = res.body.token;
                        chai.request(app)
                            .get('/auth/list')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.user.userName, 'testName');
                                chai.assert.equal(res.body.user.idNumber, '02721083E');
                                chai.assert.equal(res.body.user.userRole, 'admin');
                                chai.assert.equal(res.body.user.mail, 'userTest@mail.com');
                                done();
                            });
                    });
            });
    });

    it('should return 200 and delete user with the user id in token', (done) => {
        chai.request(app)
            .post('/auth/register')
            .set('content-type', 'application/json')
            .send({userRole: 'admin', userName:'testName', mail: 'userTest@mail.com', password: '1234', idNumber: '02721083E'})
            .end((err, res) => {
                chai.request(app)
                    .post('/auth/login')
                    .set('content-type', 'application/json')
                    .send({mail: 'userTest@mail.com', password: '1234'})
                    .end((err, res) => {
                        let token = res.body.token;
                        chai.request(app)
                            .delete('/auth/delete')
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.assert.equal(res.statusCode, 200);
                                chai.assert.equal(res.body.message.ok, 1);
                                done();
                            });
                    });
            });
    });

    it('should return 200 and the user updated', (done) => {
        let user = {userRole: 'student', userName:'testNameUpdated', mail: 'userTestUpdated@mail.com', password: '12345', idNumber: '02721083J'};
        chai.request(app)
            .post('/auth/register')
            .set('content-type', 'application/json')
            .send({userRole: 'admin', userName:'testName', mail: 'userTest@mail.com', password: '1234', idNumber: '02721083E'})
            .end((err, res) => {
                chai.request(app)
                    .post('/auth/login')
                    .set('content-type', 'application/json')
                    .send({mail: 'userTest@mail.com', password: '1234'})
                    .end((err, res) => {
                        let token = res.body.token;
                        chai.request(app)
                            .put('/auth/update')
                            .send({user: user})
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {
                                chai.request(app)
                                    .get('/auth/list')
                                    .set('Authorization', `JWT ${token}`)
                                    .end((err, res) => {
                                        chai.assert.equal(res.statusCode, 200);
                                        chai.assert.equal(res.body.user.userName, 'testNameUpdated');
                                        chai.assert.equal(res.body.user.idNumber, '02721083J');
                                        chai.assert.equal(res.body.user.userRole, 'student');
                                        chai.assert.equal(res.body.user.mail, 'userTestUpdated@mail.com');
                                        done();
                                    });
                            });
                    });
            });
    });
});
