import { Router } from "express";
import { getSubInventoriesByCompany, getSubInventories, updateSubInventory, createSubInventory, removeSubInventory } from "./../services/SubInventoryService";
import { validateUpdateSubInventory, validateCreateSubInventory } from "./../validators/SubInventoryValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateCreateSubInventory(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const price = 0;
            const stock = 0;
            const { sku, mainSku, productName } = req.body;
            const data = { sku, mainSku, productName: { en: productName }, price, stock, userSession };
            createSubInventory(data, function (err, inventory) {
                if (err) {
                    if (err.message === "Not Enough Permission to create Inventory") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "This product is currently out of stock"){
                       res.status(401).send(err.message);
                    }
                    else if (err.message === "This product does not exist in the main inventory"){
                       res.status(401).send(err.message);
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

router.put('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateUpdateSubInventory(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const userSession = req.session;
                const { sku, productName, price, stock } = req.body;
                const data = { id, sku, productName: { en: productName }, price, stock, userSession };
                updateSubInventory(data, function (err, inventory) {
                    if (err) {
                        if (err.message === "Only Child Company can edit SubInventory"){
                           res.status(400).send(err.message);
                        }
                        else if (err.message === "Not Enough Permission to update Inventory") {
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
        removeSubInventory(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only Child Company can remove Inventory"){
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

router.get('/', verifyAuthMiddleware, function (req, res, next) {
    getSubInventories(function (err, inventories) {
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
    const { company } = req.session;
    getSubInventoriesByCompany(company, function (err, inventories) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.status(200).send(inventories);
        }
    });
});

export default router;
