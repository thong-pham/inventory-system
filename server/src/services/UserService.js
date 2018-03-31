import async from "async";
import config from "config";

import { getNextUserId } from "./CounterService";
import {
    createUser as createUserDAO,
    getUserById as getUserByIdDAO,
    getUsers as getUsersDAO,
    getUserByEmail as getUserByEmailDAO,
    getUserByUsername as getUserByUsernameDAO,
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
                company: user.company
            }
            jwtUtilClientSession.signPayload(payload, function (err, token) {
                waterfallCallback(err, token, userPayload);
            });
        }
    ], callback);
}

export function getUserById(id, callback) {
    getUserByIdDAO(id, callback);
}

export function getUsers(callback) {
    getUsersDAO(callback);
}

export function validateUserToken(token, callback) {
    jwtUtilClientSession.verifyToken(token, callback);
}
