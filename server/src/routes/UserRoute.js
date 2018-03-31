import { Router } from "express";
import { createUser, getUserById, loginUser, getUsers } from "./../services/UserService";
import { validateCreateMember, validateLoginMember } from "./../validators/UserValidator"

const router = Router();

/*router.post('/', function (req, res, next) {
    validateCreateMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { name, email, roles, password, company, number } = req.body;
            const data = { name: { en: name }, email, roles, password, company, number };
            createUser(data, function (err, user) {
                if (err) {
                    if (err.message === "Email Already Exists") {
                        res.status(409).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(user);
                }
            });
        }
    });
});*/

router.post('/createUser', function (req, res, next) {
    validateCreateMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { username, roles, company, password, name, email, number } = req.body;
            const data = { username , roles, company, password, name : {en : name}, email, number};
            createUser(data, function (err, user) {
                if (err) {
                    if (err.message === "Username Already Exists") {
                        res.status(409).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(user);
                }
            });
        }
    });
});

router.post('/login', function (req, res, next) {
    validateLoginMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { username, password } = req.body;
            const data = { username, password };
            loginUser(data, function (err, token, user) {
                if (err) {
                    if (err.message === "Invalid Username or Password") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(200).send({ token: token, user: user });
                }
            });
        }
    });
});

router.get('/', function (req, res, next) {
        getUsers(function (err, users) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.status(200).send(users);
            }
        });
});

router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    if (id) {
        getUserById(id, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.status(200).send(user);
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

export default router;
