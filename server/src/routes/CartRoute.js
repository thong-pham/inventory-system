import { Router } from "express";
import { createCart, getPendingCarts, submitCart, updateCart, removeCart } from "./../services/CartService";
import { validateCart } from "./../validators/CartValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/createCart', verifyAuthMiddleware, function (req, res, next) {
    validateCart(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { sku, productName, quantity } = req.body;
            //const quantity = req.body.stock;
            const status = "pending";
            const data = { sku, quantity, status, productName:{en:productName}, userSession };
            createCart(data, function (err, cart) {
                if (err) {
                    if (err.message === "SKU Already Exists") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "Cart Already Exists"){
                       res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(cart);
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
        removeCart(data, function (err, cart) {
            if (err) {
                if (err.message === "You are not the one who create this cart"){
                   res.status(401).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send("This cart has been removed");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.get('/', verifyAuthMiddleware, function (req, res, next) {
    const username = req.session.username;
    getPendingCarts(username, function (err, carts) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(carts);
        }
    });
});


router.put('/updateCart/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateCart(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const userSession = req.session;
                const { quantity } = req.body;
                const data = { id, quantity, userSession };
                updateCart(data, function (err, cart) {
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
                        res.status(201).send(cart);
                    }
                });
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});



export default router;
