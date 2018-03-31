import { Router } from "express";
import { createCompany, getCompanyById, getCompanies } from "./../services/CompanyService";
import { validateCreateCompany } from "./../validators/CompanyValidator"

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

router.post('/createCompany', function (req, res, next) {
    validateCreateCompany(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { name, code } = req.body;
            const data = { name : { en : name}, code};
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
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(company);
                }
            });
        }
    });
});


router.get('/', function (req, res, next) {
        getCompanies(function (err, companies) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.status(200).send(companies);
            }
        });
});

router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    if (id) {
        getCompanyById(id, function (err, company) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
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
