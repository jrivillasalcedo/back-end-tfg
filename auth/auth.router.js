const express = require('express');
const router = express.Router();
const authHttpHandler = require('./auth.http');

router.route('/login')
    .post(authHttpHandler.loginUser);

router.route('/register')
    .post(authHttpHandler.registerUser);

router.route('/list')
    .get(authHttpHandler.listUser);

router.route('/delete')
    .delete(authHttpHandler.deleteUser);

router.route('/update')
    .put(authHttpHandler.updateUser);

router.route('/listAll')
    .get(authHttpHandler.listAllUser);

exports.router = router;
