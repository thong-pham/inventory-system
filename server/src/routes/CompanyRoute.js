import { Router } from "express";
import { createCompany, getCompanyById, getCompanies, editCompany, removeCompany } from "./../services/CompanyService";
import { validateCreateCompany } from "./../validators/CompanyValidator";
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

/*router.post('/', function (req, res, next) {
    validateCreateMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { name, email, roles, password, company, number } = req.body;
            const data = { name: { en: name }, email, roles, password, company, number };
            createCompany(data, function (err, Company) {
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
                    res.status(201).send(Company);
                }
            });
        }
    });
});*/

router.post('/createCompany',verifyAuthMiddleware, function (req, res, next) {
    validateCreateCompany(req.body, function (err) {
        if (err) {
            rconsole.log(err);
            res.status(400).send("Data missing");
        }
        else {
            const { name } = req.body;
            const data = { name : { en : name}};
            createCompany(data, function (err, company) {
                if (err) {
                    if (err.message === "Code Already Exists") {
                        res.status(409).send(err.message);
                    }
                    else if (err.message === "Name Already Exists") {
                        res.status(410).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send("An error happens in the backend");
                    }
                }
                else {
                    res.status(201).send(company);
                }
            });
        }
    });
});

router.put('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id){
        const userSession = req.session;
        const { name } = req.body;
        const data = { name: {en: name}, id, userSession };
        editCompany(data, function (err, company) {
            if (err) {
                if (err.message === "Not Enough Permission to edit Company") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Company Not Found") {
                    res.status(404).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send("An error happens in the backend");
                }
            }
            else {
                res.status(200).send("Update Successfully");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.delete('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        removeCompany(data, function (err, company) {
            if (err) {
                if (err.message === "Not Enough Permission to remove Company") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Company Not Found") {
                    res.status(404).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send("An error happens in the backend");
                }
            }
            else {
                res.status(200).send("Remove Successfully");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});


router.get('/',verifyAuthMiddleware, function (req, res, next) {
        getCompanies(function (err, companies) {
            if (err) {
                console.log(err);
                res.status(500).send("An error happens in the backend");
            }
            else {
                res.status(200).send(companies);
            }
        });
});

router.get('/:id',verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        getCompanyById(id, function (err, company) {
            if (err) {
                console.log(err);
                res.status(500).send("An error happens in the backend");
            }
            else {
                res.status(200).send(Company);
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

export default router;
