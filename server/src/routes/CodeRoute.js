import { Router } from "express";
import { createCode, getAllCode, removeCode, getCodeByCompany, getCodes } from "./../services/CodeService";
import { validateCode } from "./../validators/CodeValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/',verifyAuthMiddleware, function (req, res, next) {
    validateCode(req.body, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("Data missing");
        }
        else {
            const userSession = req.session;
            const { key, sku, mainSku} = req.body;
            const data = { key, sku, mainSku, userSession };
            createCode(data, function (err, code) {
                if (err) {
                    if (err.message === "Code Already Exists") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send("An error happens in the backend");
                    }
                }
                else {
                    res.status(201).send("Add Successfully");
                }
            });
        }
    });
});

router.delete('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        removeCode(data, function (err, code) {
            if (err) {
                if (err.message === "Not Enough Permission to delete code") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Code Not Found") {
                    res.status(404).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send("An error happens in the backend");
                }
            }
            else {
                res.status(200).send("Delete Successfully");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});


router.get('/',verifyAuthMiddleware, function (req, res, next) {
    //const key = req.body.key;
    getAllCode(function (err, codes) {
        if (err) {
            console.log(err);
            res.status(500).send("An error happens in the backend");
        }
        else {
            res.status(200).send(codes);
        }
    });
});

router.get('/codes',verifyAuthMiddleware, function (req, res, next) {
    //const key = req.body.key;
    getCodes(function (err, codes) {
        if (err) {
            console.log(err);
            res.status(500).send("An error happens in the backend");
        }
        else {
            res.status(200).send(codes);
        }
    });
});

router.get('/company',verifyAuthMiddleware, function (req, res, next) {
    const company = req.session.company;
    getCodeByCompany(company, function (err, codes) {
        if (err) {
            console.log(err);
            res.status(500).send("An error happens in the backend");

        }
        else {
            res.status(200).send(codes);
        }
    });
});


router.put('/:id/approveCode', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        approveCode(data, function (err, code) {
            if (err) {
                if (err.message === "This Code exceed the current stock") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Not Enough Permission to approve Code") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send("An error happens in the backend");
                }
            }
            else {
                res.status(200).send("An Code has been approved");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.put('/changeCode', verifyAuthMiddleware, function (req, res, next) {
    //const id = req.params.id;

        const userSession = req.session;
        const { codeId, cartId, quantity } = req.body;
        const data = { codeId, cartId, quantity, userSession };
        changeCode(data, function (err, code) {
            if (err) {
                if (err.message === "Not Enough Permission to change Code") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send("An error happens in the backend");
                }
            }
            else {
                res.status(200).send("An Code has been changed");
            }
        });

});



export default router;
