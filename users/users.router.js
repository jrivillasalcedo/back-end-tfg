const express = require('express');
const router = express.Router();
const userHttpHandler = require('./users.http');

router.route('/login')
    .post(userHttpHandler.loginUser);

router.route('/register')
    .post(userHttpHandler.registerUser);

router.route('/list')
    .get(userHttpHandler.listUser);

router.route('/delete')
    .delete(userHttpHandler.deleteUser);

router.route('/update')
    .put(userHttpHandler.updateUser);

router.route('/listAll')
    .get(userHttpHandler.listAllUser);

router.route('/list/:role')
    .get(userHttpHandler.listUserByRole);

exports.router = router;
