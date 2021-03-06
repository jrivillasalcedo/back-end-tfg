const uuid = require('uuid');
const crypto = require('../tools/crypto.js');
const mongoose = require('mongoose');
const { to } = require('../tools/to');

const UserModel = mongoose.model('UserModel', 
    { userRole: String, userName: String, mail: String, password: String, userId: String , idNumber: String});

const cleanUpUsers = () => {
    return new Promise(async (resolve, reject) => {
        await UserModel.deleteMany({}).exec();
        resolve();
    })
}

const registerUser = (userRole, userName, mail, password, idNumber) => {
    return new Promise(async (resolve, reject) => {
        let hashedPwd = crypto.hashPasswordSync(password);
        let userId = uuid.v4();
        let newUser = new UserModel({
            userId: userId,
            userRole: userRole,
            userName: userName,
            mail: mail,
            password: hashedPwd, 
            idNumber: idNumber
        });
        await newUser.save();
        resolve(newUser);
    });
}

const getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const getUserIdFromUserMail = (mail) => {
        return new Promise(async (resolve, reject) => {
            let [err, result] = await to(UserModel.findOne({mail: mail}).exec());
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
}

const checkUserCredentials = (mail, password) => {
    return new Promise(async (resolve, reject) => {
        let [err, user] = await to(getUserIdFromUserMail(mail));
        if (!err || user) {
            crypto.comparePassword(password, user.password, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } else {
            reject(err);
        }
    });
}

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, res] = await to(UserModel.deleteOne({userId: userId}).exec());
        if (err || !res.ok) {
            return reject(err);
        }
        resolve(res);
    })
}

const updateUser = (userId, user) => {
    return new Promise(async (resolve, reject) => {
        let hashedPwd = crypto.hashPasswordSync(user.password);
        let [err, data] = await to(UserModel.updateOne(
            {userId: userId}, 
            {$set: {userRole: user.userRole, userName: user.userName, mail: user.mail, password: hashedPwd, idNumber: user.idNumber}},
            {upsert: true}).exec());
        if (err || !data) {
            return reject(err);
        }
        resolve();
    })
    
}

const getUserRole = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({userId: userId}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result.userRole);
    });
    
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.find({}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const getAllUserByRole = (userRole) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.find({userRole: userRole}).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}



exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.getUserIdFromUserMail = getUserIdFromUserMail;
exports.getUser = getUser;
exports.cleanUpUsers = cleanUpUsers;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUserRole = getUserRole;
exports.getAllUser = getAllUser;
exports.getAllUserByRole = getAllUserByRole;