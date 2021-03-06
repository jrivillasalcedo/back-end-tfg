const usersController = require('./users.controller');
const jwt = require('jsonwebtoken');
const {to} = require('../tools/to');
require('dotenv').config();




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
    const token = jwt.sign({userId: user.userId}, process.env.SECRET_KEY);
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




const listUser = async (req, res) => {
    let [err, user] = await to(usersController.getUser(req.user.userId));
    if (err) {
        return res.status(400).json({message: "User not found"});
    }
    res.status(200).json({user: user})
}




const listAllUser = async (req, res) => {
    let [error, role] = await to(usersController.getUserRole(req.user.userId));
    if (error) {
        return res.status(401).json({message: "You do not have permissions"});
    }

    if(role == process.env.ADMIN){
        let [err, users] = await to(usersController.getAllUser());
        if (err) {
            return res.status(400).json({message: "No users found"});
        }
        return res.status(200).json({users: users})
    }
    return res.status(401).json({message: "You do not have permissions"});
    
}




const deleteUser = async (req, res) => {
    let [err, response] = await to(usersController.deleteUser(req.user.userId));
    if (err) {
        return res.status(400).json({message: "User not found"});
    }
    res.status(200).json({message: response})
}




const updateUser = async (req, res) => {
    let [err, response] = await to(usersController.updateUser(req.user.userId, req.body.user));
    if (err) {
        return res.status(400).json({message: "Error while update user"});
    }
    res.status(200).json({message: response})
}




const listUserByRole = async (req, res) => {

    let [error, role] = await to(usersController.getUserRole(req.user.userId));
    let roleToList = req.params.role;

    if(role == process.env.STUDENT){
        return res.status(401).json({message: "You do not have permissions"});
    }

    if(role == process.env.TEACHER && roleToList != process.env.STUDENT){
        return res.status(401).json({message: "You do not have permissions"});
    }

    let [err, users] = await to(usersController.getAllUserByRole(roleToList));
        if (err) {
            return res.status(400).json({message: "No users found"});
        }
    return res.status(200).json({users: users})
    
}







exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.listUser = listUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.listAllUser = listAllUser;
exports.listUserByRole = listUserByRole