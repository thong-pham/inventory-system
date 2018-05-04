import { Router } from "express";
import { createFeature, removeFeature,
         getQualities, getTypes, getPatterns, getColors, getSizes, getUnits
       } from "./../services/FeatureService";
import { validateFeature } from "./../validators/FeatureValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateFeature(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { description, key, kind } = req.body;
            const data = { description, key, kind, userSession };
            createFeature(data, function (err, feature) {
                if (err) {
                    if (err.message === "Key Already Exists") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send("Create Successfully");
                }
            });
        }
    });
});

router.get('/quality', verifyAuthMiddleware, function (req, res, next) {
    getQualities(function (err, qualities) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(qualities);
        }
    });
});

router.get('/type', verifyAuthMiddleware, function (req, res, next) {
    getTypes(function (err, types) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(types);
        }
    });
});

router.get('/pattern', verifyAuthMiddleware, function (req, res, next) {
    getPatterns(function (err, patterns) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(patterns);
        }
    });
});

router.get('/color', verifyAuthMiddleware, function (req, res, next) {
    getColors(function (err, colors) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(colors);
        }
    });
});

router.get('/size', verifyAuthMiddleware, function (req, res, next) {
    getSizes(function (err, sizes) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(sizes);
        }
    });
});

router.get('/unit', verifyAuthMiddleware, function (req, res, next) {
    getUnits(function (err, units) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(units);
        }
    });
});

router.delete('/:kind/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    const kind = req.params.kind;
    if (id) {
        const userSession = req.session;
        const data = { id, kind, userSession };
        removeFeature(data, function (err, feature) {
            if (err) {
                if (err.message === "Not Enough Permission to delete feature") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Feature Not Found") {
                    res.status(404).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
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

export default router;
