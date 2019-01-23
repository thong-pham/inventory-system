import { Router } from "express";
import { createLocation, getLocationById, getLocations, editLocation, removeLocation, moveProduct } from "./../services/LocationService";
import { validateCreateLocation } from "./../validators/LocationValidator";
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/createLocation', verifyAuthMiddleware, function (req, res, next) {
    validateCreateLocation(req.body, function (err) {
        if (err) {
            rconsole.log(err);
            res.status(400).send("Data missing");
        }
        else {
            const userSession = req.session;
            const { name } = req.body;
            const data = { name: name, products: [], total: 0, userSession };
            createLocation(data, function (err, location) {
                if (err) {
                    if (err.message === "Name Already Exists") {
                        res.status(410).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send("An error happens in the backend");
                    }
                }
                else {
                    res.status(201).send(location);
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
        const data = { name: name, id, userSession };
        editLocation(data, function (err, location) {
            if (err) {
                if (err.message === "Not Enough Permission to edit Location") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Location Not Found") {
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

router.put('/moveProduct/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id){
        const userSession = req.session;
        const { product_sku, newLocation, newQuantity } = req.body;
        const data = { product_sku: product_sku, newLocation: newLocation, quantity: newQuantity, id, userSession };
        moveProduct(data, function (err, location) {
            if (err) {
                if (err.message === "Not Enough Permission to edit Location") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Location Not Found") {
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

router.put('/addProduct/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id){
        const userSession = req.session;
        const { product } = req.body;
        const data = { product: product, id, userSession };
        addProduct(data, function (err, location) {
            if (err) {
                if (err.message === "Not Enough Permission to edit Location") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Location Not Found") {
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
        removeLocation(data, function (err, location) {
            if (err) {
                if (err.message === "Not Enough Permission to remove Location") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Location Not Found") {
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


router.get('/', verifyAuthMiddleware, function (req, res, next) {
        getLocations(function (err, locations) {
            if (err) {
                console.log(err);
                res.status(500).send("An error happens in the backend");
            }
            else {
                res.status(200).send(locations);
            }
        });
});

router.get('/:id',verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        getLocationById(id, function (err, location) {
            if (err) {
                console.log(err);
                res.status(500).send("An error happens in the backend");
            }
            else {
                res.status(200).send(Location);
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

export default router;
