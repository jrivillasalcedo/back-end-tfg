const usersController = require('./users.controller');
const jwt = require('jsonwebtoken');
const {to} = require('../tools/to');

const loginUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({message: 'Missing data'});
    } else if (!req.body.mail || !req.body.password) {
        return res.status(400).json({message: 'Missing data'});
    }

    let [err, resp] = await to(usersController.checkUserCredentials(req.body.mail, req.body.password));
    // Si no son validas, error
    if (err || !resp) {
        return res.status(401).json({message: 'Invalid credentials'});
    }
    let user = await usersController.getUserIdFromUserMail(req.body.mail);
    const token = jwt.sign({userId: user.userId}, 'secretPassword');
    res.status(200).json(
        {token: token}
    )
}

const registerUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({message: 'Missing data'});
    } else if (!req.body.mail || !req.body.password || !req.body.userName || !req.body.userRole || !req.body.idNumber) {
        return res.status(400).json({message: 'Missing data'});
    }
    let [err, resp] = await to(usersController.registerUser(req.body.userRole, req.body.userName, req.body.mail, req.body.password, req.body.idNumber));
    if (err || !resp) {
        return res.status(400).json({message: err});
    }
    res.status(200).send();
}


exports.loginUser = loginUser;
exports.registerUser = registerUser;