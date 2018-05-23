import { Router } from "express";
import { createInventory, approveInventory, removeInventory,
        getInventories, getPendingInventories,
        updateInventory, createRequest, getPendingRequests,
        approveRequest, importInventory, getPendingImports, removeImport
       } from "./../services/InventoryService";
import { getSubInventoriesByCompany, getSubInventories } from "./../services/SubInventoryService";
import { validateCreateInventory, validateUpdateByPhone } from "./../validators/InventoryValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateCreateInventory(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { list, price, stock, unit } = req.body;
            var count = 0;
            list.forEach(function(item){
                var sku = item.sku;
                var productName = item.desc;
                const data = { sku, productName: {en: productName}, price, stock, userSession, unit };
                createInventory(data, function (err, inventory) {
                    if (err) {
                        if (count === list.length - 1){
                            if (err.message === "Not Enough Permission to create Inventory") {
                                res.status(401).send(err.message);
                            }
                            else if (err.message === "SKU Already Exists"){
                                res.status(402).send(err.message);
                            }
                            else {
                                console.log(err);
                                res.status(500).send(err);
                            }
                        }                  
                    }
                    else {
                        if (count === list.length - 1){
                            res.status(201).send("Add Successfully");
                        }
                    }
                    count += 1;
                });
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
                        if (err.message === "Only ISRA can edit Inventory"){
                           res.status(401).send(err.message);
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
                if (err.message === "Only ISRA can remove Inventory"){
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
                res.status(200).send("Delete Successfully");
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
                res.status(200).send("An Import has been processed");
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

router.get('/pendingImports', verifyAuthMiddleware, function (req, res, next) {
    getPendingImports(function (err, imports) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(imports);
        }
    });
});

router.delete('/:id/import', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        removeImport(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only ISRA can remove Import"){
                   res.status(401).send(err.message);
                }
                else if (err.message === "Not Enough Permission to remove Import") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Only pending import can be removed") {
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
                res.status(200).send("Delete Successfully");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.post('/importInventory', verifyAuthMiddleware, function (req, res, next) {
    validateUpdateByPhone(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { code, quantity } = req.body;
            const data = { code, quantity, userSession };
            importInventory(data, function (err, inventory) {
                if (err) {
                    if (err.message === "Not Enough Permission to import Inventory") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "This code does not exists"){
                        res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    const message = quantity + " items have been added";
                    res.status(201).send(message);
                }
            });
        }
    });
});

export default router;
