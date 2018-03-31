import { Router } from "express";
import { createInventory, approveInventory, removeInventory,
        getInventories, getPendingInventories,
        updateInventory, createRequest, getPendingRequests, approveRequest } from "./../services/InventoryService";
import { getSubInventories } from "./../services/SubInventoryService";
import { validateCreateInventory, validateRequestInventory } from "./../validators/InventoryValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateCreateInventory(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { sku, productName, price, stock } = req.body;
            const data = { sku, productName: { en: productName }, price, stock, userSession };
            createInventory(data, function (err, inventory) {
                if (err) {
                    if (err.message === "Not Enough Permission to create Inventory") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "SKU Already Exists"){
                       res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(inventory);
                }
            });
        }
    });
});

router.post('/requestInventory', verifyAuthMiddleware, function (req, res, next) {
    validateRequestInventory(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { sku } = req.body;
            const quantity = req.body.stock;
            const status = "pending";
            const data = { sku, quantity, status, userSession };
            createRequest(data, function (err, request) {
                if (err) {
                    if (err.message === "Not Enough Permission to make Request") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "SKU Already Exists"){
                       res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(request);
                }
            });
        }
    });
});

router.put('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateCreateInventory(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const userSession = req.session;
                const { sku, productName, price, stock } = req.body;
                const data = { id, sku, productName: { en: productName }, price, stock, userSession };
                updateInventory(data, function (err, inventory) {
                    if (err) {
                        if (err.message === "Only Mother Company can edit Inventory"){
                           res.status(400).send(err.message);
                        }
                        else if (err.message === "Not Enough Permission to create Inventory") {
                            res.status(402).send(err.message);
                        }
                        else if (err.message === "Inventory Not Found") {
                            res.status(404).send(err.message);
                        }
                        else {
                            console.log(err);
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.status(201).send(inventory);
                    }
                });
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
        removeInventory(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only Mother Company can remove Inventory"){
                   res.status(401).send(err.message);
                }
                else if (err.message === "Not Enough Permission to remove Inventory") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "An Operation is Pending on the Inventory") {
                    res.status(403).send(err.message);
                }
                else if (err.message === "Inventory Not Found") {
                    res.status(404).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send();
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.put('/:id/approve', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        approveInventory(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only Pending Inventories can be approved") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Not Enough Permission to approve Inventory") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send("A Request has been approved");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.get('/', verifyAuthMiddleware, function (req, res, next) {
    getInventories(function (err, inventories) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(inventories);
        }
    });
});

router.get('/sub', verifyAuthMiddleware, function (req, res, next) {
    const userSession = req.session;
    getSubInventories(userSession, function (err, inventories) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.status(200).send(inventories);
        }
    });
});

router.get('/pending', verifyAuthMiddleware, function (req, res, next) {
    getPendingInventories(function (err, inventories) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(inventories);
        }
    });
});

router.get('/pendingRequests', verifyAuthMiddleware, function (req, res, next) {
    getPendingRequests(function (err, requests) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.status(200).send(requests);
        }
    });
});

router.put('/:id/approveRequest', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        approveRequest(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only Pending Requests can be approved") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Not Enough Permission to approve Request") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send("A Request has been approved");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});



export default router;
