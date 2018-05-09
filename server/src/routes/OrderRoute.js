import { Router } from "express";
import { createOrder, getPendingOrders, getPendingOrderByCompany, approveOrder,
        changeOrder, removeOrder, getApprovedOrders, getApprovedOrdersByCompany } from "./../services/OrderService";
import { validateOrderInventory } from "./../validators/OrderValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateOrderInventory(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const status = "pending";
            const details = req.body.carts;
            //console.log(details);
            const data = { details, status, userSession };
            createOrder(data, function (err, order) {
                if (err) {
                    if (err.message === "Not Enough Permission to make Order") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "Order Already Exists"){
                       res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(order);
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
        removeOrder(data, function (err, order) {
            if (err) {
                if (err.message === "Only Child Company can remove Order"){
                   res.status(401).send(err.message);
                }
                else if (err.message === "Not Enough Permission to remove Order") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Only Company created this order can remove it") {
                    res.status(402).send(err.message);
                }
                else if (err.message === "Only Pending Order can be removed") {
                    res.status(403).send(err.message);
                }
                else if (err.message === "Order Not Found") {
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

router.get('/all', verifyAuthMiddleware, function (req, res, next) {
    getPendingOrders(function (err, orders) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(orders);
        }
    });
});

router.get('/allApprovedOrders', verifyAuthMiddleware, function (req, res, next) {
    getApprovedOrders(function (err, orders) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(orders);
        }
    });
});

router.get('/approvedOrders', verifyAuthMiddleware, function (req, res, next) {
    const company = req.session.company;
    getApprovedOrdersByCompany(company, function (err, orders) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(orders);
        }
    });
});

router.get('/', verifyAuthMiddleware, function (req, res, next) {
    const company = req.session.company;
    getPendingOrderByCompany(company, function (err, order) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(order);
        }
    });
});


router.put('/:id/approveOrder', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        approveOrder(data, function (err, order) {
            if (err) {
                //console.log(err.err.message);
                if (err.err.message === "This Order exceeds the current stock") {
                    res.status(400).send({message: err.err.message, denies: err.denies, id: err.id});
                }
                else if (err.message === "Not Enough Permission to approve Order") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send("An Order has been approved");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.put('/changeOrder', verifyAuthMiddleware, function (req, res, next) {
    //const id = req.params.id;

        const userSession = req.session;
        const { orderId, cartId, quantity } = req.body;
        const data = { orderId, cartId, quantity, userSession };
        changeOrder(data, function (err, order) {
            if (err) {
                if (err.message === "Not Enough Permission to change Order") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send("An Order has been changed");
            }
        });

});



export default router;
