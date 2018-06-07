import { Router } from "express";
import { createInventory, approveInventory, approveInventoryOut, removeInventory,
        getInventories, getInventoriesInTrash, recoverInventory,
        updateInventory, createRequest, removeInventoryInTrash,
        importInventory, getPendingImports, removeImport, updateImport, duplicateImport,
        exportInventory, getPendingExports, updateExport, removeExport, duplicateExport
       } from "./../services/InventoryService";
import { getSubInventoriesByCompany, getSubInventories } from "./../services/SubInventoryService";
import { validateCreateInventory, validateUpdateInventory, validateImportInventory, validateDuplicateImport } from "./../validators/InventoryValidator"
import { verifyAuthMiddleware } from "./../utils/AuthUtil";

const router = Router();

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateCreateInventory(req.body, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("Data missing");
        }
        else {
            const userSession = req.session;
            const { list, price, unit, capacity } = req.body;
            var count = 0;
            var errorMessage = "";
            var completeMessage = "";
            list.forEach(function(item){
                var sku = item.sku;
                var productName = item.desc;
                const data = { sku, productName: {en: productName}, price, capacity, userSession, unit };
                createInventory(data, function (err, inventory) {
                    if (err) {
                        if (err.message === "Not Enough Permission to create Inventory") {
                            //res.status(401).send(err.message);
                        }
                        else if (err.message === "SKU Already Exists"){
                            //res.status(402).send(err.message);
                            errorMessage = errorMessage + sku + " | ";
                        }
                        else {
                            //console.log(err);
                            //res.status(500).send(err);
                        }
                    }
                    else {
                        //res.status(201).send("Add Successfully");
                        completeMessage = completeMessage + sku + " | ";
                    }
                    count += 1;

                    if ( count === list.length ){
                        res.status(200).send({errorMessage: errorMessage, completeMessage: completeMessage});
                    }
                });
            });
        }
    });
});

router.put('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateUpdateInventory(req.body, function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("Data missing");
            }
            else {
                const userSession = req.session;
                const { sku, productName, price, stock, unit, capacity } = req.body;
                const data = { id, sku, productName: { en: productName }, price, stock, unit, capacity, userSession };
                updateInventory(data, function (err, inventory) {
                    if (err) {
                        if (err.message === "Only ISRA can update Inventory"){
                           res.status(401).send(err.message);
                        }
                        else if (err.message === "Not Enough Permission to create Inventory") {
                            res.status(402).send(err.message);
                        }
                        else if (err.message === "An Operation is Pending on the Inventory") {
                            res.status(404).send(err.message);
                        }
                        else if (err.message === "Inventory Not Found") {
                            res.status(404).send(err.message);
                        }
                        else {
                            console.log(err);
                            res.status(500).send("An error happens in the backend");
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

router.put('/:id/approve', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        approveInventory(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only ISRA can approve Inventory") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Not Enough Permission to approve Inventory") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Only Pending Inventories can be approved") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Import Not Found") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send("An error happens in the backend");
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

router.put('/:id/approveOut', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        approveInventoryOut(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only ISRA can approve Inventory") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Not Enough Permission to approve Inventory") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Only Pending Inventories can be approved") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Export is larger than the current stock") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Import Not Found") {
                    res.status(400).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send("An error happens in the backend");
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

router.put('/:id/recover', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        recoverInventory(data, function (err, inventory) {
            if (err) {
                if (err.message === "Only ISRA can recover Inventory"){
                   res.status(401).send(err.message);
                }
                else if (err.message === "Not Enough Permission to recover Inventory") {
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
                    res.status(500).send("An error happens in the backend");
                }
            }
            else {
                res.status(200).send("Recover Successfully");
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.delete('/:id/trash', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        removeInventoryInTrash(data, function (err, inventory) {
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

router.get('/', verifyAuthMiddleware, function (req, res, next) {
    getInventories(function (err, inventories) {
        if (err) {
            console.log(err);
            res.status(500).send("An error happens in the backend");

        }
        else {
            res.status(200).send(inventories);
        }
    });
});

router.get('/trash', verifyAuthMiddleware, function (req, res, next) {
    getInventoriesInTrash(function (err, inventories) {
        if (err) {
            console.log(err);
            res.status(500).send("An error happens in the backend");

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
            res.status(500).send("An error happens in the backend");

        }
        else {
            res.status(200).send(imports);
        }
    });
});

router.get('/pendingExports', verifyAuthMiddleware, function (req, res, next) {
    getPendingExports(function (err, imports) {
        if (err) {
            console.log(err);
            res.status(500).send("An error happens in the backend");

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
                else if (err.message === "Import Not Found") {
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

router.delete('/:id/export', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        removeExport(data, function (err, inventory) {
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
                else if (err.message === "Import Not Found") {
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

router.post('/importInventory', verifyAuthMiddleware, function (req, res, next) {
    validateImportInventory(req.body, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("Data missing");
        }
        else {
            const userSession = req.session;
            const { code, quantity, capacity, count } = req.body;
            const data = { code, quantity, capacity, count, userSession };
            importInventory(data, function (err, importData) {
                if (err) {
                    if (err.message === "Not Enough Permission to import Inventory") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "This code does not exists"){
                        res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send("An error happens in the backend");
                    }
                }
                else {
                    const message = quantity + " items have been added";
                    res.status(201).send(importData);
                }
            });
        }
    });
});

router.post('/exportInventory', verifyAuthMiddleware, function (req, res, next) {
    validateImportInventory(req.body, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("Data missing");
        }
        else {
            const userSession = req.session;
            const { code, quantity, capacity, count } = req.body;
            const data = { code, quantity, capacity, count, userSession };
            exportInventory(data, function (err, exportData) {
                if (err) {
                    if (err.message === "Not Enough Permission to import Inventory") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "This code does not exists"){
                        res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send("An error happens in the backend");
                    }
                }
                else {
                    const message = quantity + " items have been added";
                    res.status(201).send(exportData);
                }
            });
        }
    });
});

router.post('/duplicateImport', verifyAuthMiddleware, function (req, res, next) {
    validateDuplicateImport(req.body, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("Data missing");
        }
        else {
            const userSession = req.session;
            const { id, count } = req.body;
            const data = { id, count, userSession };
            duplicateImport(data, function (err, importData) {
                if (err) {
                    if (err.message === "Only ISRA can duplicate Import") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "Not Enough Permission to duplicate Import"){
                        res.status(401).send(err.message);
                    }
                    else if (err.message === "Only pending import can be duplicate"){
                        res.status(401).send(err.message);
                    }
                    else if (err.message === "Import Not Found"){
                        res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send("An error happens in the backend");
                    }
                }
                else {
                    //const message = quantity + " items have been added";
                    res.status(201).send(importData);
                }
            });
        }
    });
});

router.post('/duplicateExport', verifyAuthMiddleware, function (req, res, next) {
    validateDuplicateImport(req.body, function (err) {
        if (err) {
            console.log(err);
            res.status(400).send("Data missing");
        }
        else {
            const userSession = req.session;
            const { id, count } = req.body;
            const data = { id, count, userSession };
            duplicateExport(data, function (err, exportData) {
                if (err) {
                    if (err.message === "Only ISRA can duplicate Import") {
                        res.status(400).send(err.message);
                    }
                    else if (err.message === "Not Enough Permission to duplicate Import"){
                        res.status(401).send(err.message);
                    }
                    else if (err.message === "Only pending import can be duplicate"){
                        res.status(401).send(err.message);
                    }
                    else if (err.message === "Import Not Found"){
                        res.status(401).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send("An error happens in the backend");
                    }
                }
                else {
                    //const message = quantity + " items have been added";
                    res.status(201).send(exportData);
                }
            });
        }
    });
});

router.put('/:id/import', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
      validateImportInventory(req.body, function (err) {
          if (err) {
              console.log(err);
              res.status(400).send("Data missing");
          }
          else {
              const userSession = req.session;
              const { code, quantity, capacity, count } = req.body;
              const data = { id, userSession, code, quantity, capacity, count };
              updateImport(data, function (err, importData) {
                  if (err) {
                      if (err.message === "Only ISRA can change Import"){
                         res.status(401).send(err.message);
                      }
                      else if (err.message === "Not Enough Permission to change Import") {
                          res.status(402).send(err.message);
                      }
                      else if (err.message === "Only pending import can be changed") {
                          res.status(403).send(err.message);
                      }
                      else if (err.message === "Import Not Found") {
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
       });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.put('/:id/export', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
      validateImportInventory(req.body, function (err) {
          if (err) {
              console.log(err);
              res.status(400).send("Data missing");
          }
          else {
              const userSession = req.session;
              const { code, quantity, capacity, count } = req.body;
              const data = { id, userSession, code, quantity, capacity, count };
              updateExport(data, function (err, exportData) {
                  if (err) {
                      if (err.message === "Only ISRA can change Import"){
                         res.status(401).send(err.message);
                      }
                      else if (err.message === "Not Enough Permission to change Import") {
                          res.status(402).send(err.message);
                      }
                      else if (err.message === "Only pending import can be changed") {
                          res.status(403).send(err.message);
                      }
                      else if (err.message === "Import Not Found") {
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
       });
    }
    else {
        res.status(400).send("id param required");
    }
});

export default router;
