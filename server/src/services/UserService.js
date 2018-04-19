import async from "async";
import config from "config";

import { getNextUserId } from "./CounterService";
import {
    createUser as createUserDAO,
    getUserById as getUserByIdDAO,
    getUsers as getUsersDAO,
    getUserByUsername as getUserByUsernameDAO,
    updateUserById as updateUserByIdDAO,
    removeUserById as removeUserByIdDAO
} from "./../dao/mongo/impl/UserDAO";
import { generatePasswordHash, validatePasswordHash } from "./../utils/PasswordUtil";
import JWTUtil from "./../utils/JWTUtil";

const clientSessionConfig = config.get("authenticate.clientSession");

const jwtUtilClientSession = new JWTUtil(clientSessionConfig);

export function createUser(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            getUserByUsernameDAO(data.username, waterfallCallback);
        },
        function (user, waterfallCallback) {
            if (user) {
                var err = new Error("Email Already Exists");
                waterfallCallback(err);
            }
            else {
                waterfallCallback();
            }
        },
        function (waterfallCallback) {
            generatePasswordHash(data.password, function (err, hash) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    data.passwordHash = hash;
                    delete data.password;
                    waterfallCallback();
                }
            })
        },
        function (waterfallCallback) {
            getNextUserId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            data.id = counterDoc.counter;
            createUserDAO(data, waterfallCallback);
        }
    ], callback);
}

export function loginUser(data, callback) {
    const username = data.username;
    const password = data.password;
    async.waterfall([
        function (waterfallCallback) {
            getUserByUsernameDAO(username, waterfallCallback);
        },
        function (user, waterfallCallback) {
            if (user) {
                waterfallCallback(null, user);
            }
            else {
                const err = new Error("Invalid Username or Password");
                waterfallCallback(err);
            }
        },
        function (user, waterfallCallback) {
            validatePasswordHash(password, user.passwordHash, function (err, isSame) {
                waterfallCallback(err, user, isSame);
            });
        },
        function (user, isSame, waterfallCallback) {
            if (isSame === true) {
                waterfallCallback(null, user);
            }
            else {
                const err = new Error("Invalid Username or Password");
                waterfallCallback(err);
            }
        },
        function (user, waterfallCallback) {
            const payload = {
                userId: user.id,
                roles: user.roles,
                company: user.company,
                username: user.username
            }
            const userPayload = {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                username: user.username,
                company: user.company,
                number: user.number
            }
            jwtUtilClientSession.signPayload(payload, function (err, token) {
                waterfallCallback(err, token, userPayload);
            });
        }
    ], callback);
}

export function changePassword(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            getUserByIdDAO(data.id, function(err, user){
                  if (err){
                      waterfallCallback(err);
                  }
                  else{
                      waterfallCallback(null, user);
                  }
            });
        },
        function (user, waterfallCallback) {
            validatePasswordHash(data.currentPass, user.passwordHash, function (err, isSame) {
                waterfallCallback(err, user, isSame);
            });
        },
        function (user, isSame, waterfallCallback) {
            if (isSame === true) {
                waterfallCallback();
            }
            else {
                const err = new Error("Invalid Password");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            generatePasswordHash(data.newPass, function (err, hash) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    const update = {
                        passwordHash: hash
                    }
                    updateUserByIdDAO(data.id, update, waterfallCallback);
                }
            })
        }
    ], callback);
}

export function updateInfo(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            getUserByIdDAO(data.id, function(err, user){
                  if (err){
                      waterfallCallback(err);
                  }
                  else{
                      waterfallCallback(null, user);
                  }
            });
        },
        function (user, waterfallCallback) {
            const update = {
                name: data.newName,
                number: data.newNumber,
                email: data.newEmail
            }
            updateUserByIdDAO(data.id, update, waterfallCallback);
        }
    ], callback);
}

export function editUser(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            getUserByIdDAO(data.id, function(err, user){
                  if (err){
                      waterfallCallback(err);
                  }
                  else{
                      waterfallCallback(null, user);
                  }
            });
        },
        function (user, waterfallCallback) {
            const update = {
                username: data.username,
                company: data.company,
                roles: data.roles
            }
            updateUserByIdDAO(data.id, update, waterfallCallback);
        }
    ], callback);
}

export function removeUser(data, callback){
    async.waterfall([
        function(waterfallCallback){
            const { roles } = data.userSession;
            const { isAdmin } = getUserRoles(roles);
            if (isAdmin){
                waterfallCallback();
            }
            else{
                const err = new Error("Not Enough Permission to remove User");
                waterfallCallback(err);
            }
        },
        function(waterfallCallback){
            const id = data.id;
            getUserByIdDAO(id, function(err, user){
                if (err){
                    waterfallCallback(err);
                }
                else if (user){
                    removeUserByIdDAO(id, waterfallCallback);
                }
                else {
                    const err = new Error("User Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ],callback)
}

export function getUser(id, callback) {
    getUserByIdDAO(id, callback);
}

export function getUsers(callback) {
    getUsersDAO(callback);
}

export function validateUserToken(token, callback) {
    jwtUtilClientSession.verifyToken(token, callback);
}

function getUserRoles(roles) {
    const isAdmin = roles.indexOf("admin") >= 0;
    return { isAdmin };
}
