const express = require('express');
const router = express.Router();
const authHttpHandler = require('./auth.http');

router.route('/login')
    .post(authHttpHandler.loginUser);

router.route('/register')
    .post(authHttpHandler.registerUser);

router.route('/list')
    .get(authHttpHandler.listUser);
    
exports.router = router;
