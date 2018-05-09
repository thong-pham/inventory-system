import async from "async";

import {
    createOrder as createOrderDAO,
    getPendingOrders as getPendingOrdersDAO,
    getOrderById as getOrderByIdDAO,
    updateOrderById as updateOrderByIdDAO,
    getPendingOrderByCompany as getPendingOrderByCompanyDAO,
    changeOrderDetails as changeOrderDetailsDAO,
    removeOrderById as removeOrderByIdDAO,
    getApprovedOrders as getApprovedOrdersDAO,
    getApprovedOrdersByCompany as getApprovedOrdersByCompanyDAO

} from "./../dao/mongo/impl/OrderDAO";

import { updateCartById as updateCartByIdDAO,
         removeCartById as removeCartByIdDAO,
} from "./../dao/mongo/impl/CartDAO";

import {
    createSubInventory as createSubInventoryDAO,
    getSubInventoryBySku as getSubInventoryBySkuDAO,
    updateSubInventoryById as updateSubInventoryByIdDAO,
} from "./../dao/mongo/impl/SubInventoryDAO";

import { getNextOrderId, getNextSubInventoryId } from "./CounterService";

import { getInventoryBySku as getInventoryBySkuDAO,
         updateInventoryById as updateInventoryByIdDAO,
} from "./../dao/mongo/impl/InventoryDAO";

import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

function getLatestHistory(inventory) {
    let latestHistory = null
    inventory.history.every(function (history) {
        if (latestHistory) {
            if ((new Date(history.timestamp)).getTime() > (new Date(latestHistory.timestamp)).getTime()) {
                latestHistory = history;
            }
        }
        else {
            latestHistory = history;
        }
        return true;
    });
    return latestHistory;
}

export function createOrder(data, callback){
   async.waterfall([
     function (waterfallCallback){
        getNextOrderId(function (err, counterDoc){
            waterfallCallback(err, data, counterDoc);
        });
     },
     function (data, counterDoc, waterfallCallback){
          data.details.forEach(function(cart){
              removeCartByIdDAO(cart.id, function(err, res){
                  if (err){
                      waterfallCallback(err);
                  }
              });
          });
         const { company, username } = data.userSession;
         data.id = counterDoc.counter;
         data.company = company;
         data.createdBy = username;
         data.approvedBy = " ";
         createOrderDAO(data, waterfallCallback);
     }
   ],callback);
}

export function approveOrder(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isStoreManager } = getUserRoles(roles);
            if (isStoreManager && company === 'Mother Company') {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to approve Order");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const { company } = data.userSession;
            const id = data.id;
            getOrderByIdDAO(id, function (err, order) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    if (order.status !== "pending"){
                          const err = new Error("Only Pending Orders can be approved");
                          waterfallCallback(err);
                    }
                    else {
                          var inventories = [];
                          var carts = [];
                          var denies = [];
                          var count = 0;
                          order.details.forEach(function(cart){
                              if (carts.length < order.details.length){
                                  getInventoryBySkuDAO(cart.mainSku, function(err, inventory){
                                     if (err){
                                        waterfallCallback(err);
                                     }
                                     else {
                                          if (cart.quantity <= inventory.stock){
                                              inventories.push(inventory);
                                              carts.push(cart);
                                              count += 1;
                                              if (carts.length === order.details.length){
                                                  //console.log(carts.length);
                                                  waterfallCallback(null, inventories, carts, order);
                                              }

                                          }
                                          else {
                                              const deny = {
                                                  cartId: cart.id,
                                                  mainStock: inventory.stock
                                              }
                                              denies.push(deny);

                                              count += 1;
                                              if (count === order.details.length){
                                                  const err = new Error("This Order exceeds the current stock");
                                                  const data = {
                                                      err: err,
                                                      denies: denies,
                                                      id: order.id
                                                  }
                                                  waterfallCallback(data);
                                              }
                                          }
                                       }
                                  });
                               }
                          });
                     }
                }
            });
        },
        function (inventories, carts, order, waterfallCallback) {
            //console.log(carts);
            inventories.forEach(function(inventory){
                const latestHistory = getLatestHistory(inventory);
                //const id = data.id;
                if (latestHistory.action === "created" || latestHistory.action === "updated" ||
                    latestHistory.action === "approvedOut" || latestHistory.action === "approvedIn") {
                    var newStock = 0;
                    carts.forEach(function(cart){
                        if (cart.mainSku === inventory.sku){
                            newStock = inventory.stock - cart.quantity;
                        }
                    });
                    const update = {
                        stock: newStock,
                        $push: {
                              history: {
                              action: "approvedOut",
                              userId: data.userSession.userId,
                              timestamp: new Date()
                              }
                          }
                      }
                      updateInventoryByIdDAO(inventory.id, update, function(err, res){
                          if (err){
                              //console.log(err);
                              waterfallCallback(err);
                          }
                      });
                  }
                  else {
                      const err = new Error("Weird Flow in Inventory Approval");
                      //console.log(err);
                      waterfallCallback(err);
                  }
            });
            waterfallCallback(null, carts, order);

        },
        function (carts, order, waterfallCallback){
             const id = data.id;
             const { company } = data.userSession;
             carts.forEach(function(cart){
                 getSubInventoryBySkuDAO(cart.sku, function (err, subInv){
                       if (subInv) {
                           var updateStock = subInv.stock + cart.quantity;
                           const update = {
                               stock: updateStock,
                               $push: {
                                   history: {
                                       action: "updated",
                                       userId: data.userSession.userId,
                                       timestamp: new Date(),
                                       payload: {
                                           sku: subInv.sku,
                                           productName: subInv.productName,
                                           price: subInv.price,
                                           stock: updateStock,
                                       }
                                   }
                               }
                           }
                           updateSubInventoryByIdDAO(subInv.id, update, function(err, res){
                                if (err){
                                    //console.log(err);
                                    waterfallCallback(err);
                                }
                           });
                       }
                       else {
                            const err = new Error("Inventory Not Found");
                            waterfallCallback(err);
                       }
                  });
            });
            waterfallCallback(null, order);
        },
        function (order, waterfallCallback){
              const id = data.id;
              const { username } = data.userSession;;
              order.status = "approved";
              order.approvedBy = username;
              updateOrderByIdDAO(id, order, waterfallCallback);
        }
    ], callback);
}

export function changeOrder(data, callback){
   async.waterfall([
     function (waterfallCallback) {
         const { roles, company } = data.userSession;
         const { isStoreManager } = getUserRoles(roles);
         if (isStoreManager && company === 'Mother Company') {
             waterfallCallback();
         }
         else {
             const err = new Error("Not Enough Permission to approve Order");
             waterfallCallback(err);
         }
     },
     function (waterfallCallback){
        getOrderByIdDAO(data.orderId, function(err, order){
            if (err){
                waterfallCallback(err);
            }
            else if (order.status === 'approved')
            {
                const err = new Error("Only pending orders can be changed");
                waterfallCallback(err);
            }
            else {
                waterfallCallback(null, order.details);
            }
        });
     },
     function (details, waterfallCallback){
         var temp = [];
         const id = data.orderId;
         console.log(details);
         details.forEach(function(cart){
              if (cart.id === data.cartId){
                  cart.quantity = data.quantity;
                  temp.push(cart);
              }
              else {
                  temp.push(cart);
              }
         });
         temp.sort(compare);
         console.log(temp);
         const update = {
            details: temp
         }
         changeOrderDetailsDAO(id, update, waterfallCallback);
     }
   ],callback);
}

export function removeOrder(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { roles, company } = data.userSession;
            const { isSales } = getUserRoles(roles);
            if (company === 'Mother Company') {
                const err = new Error("Only Child Company can remove Order");
                waterfallCallback(err)
            }
            else if (isSales) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to remove Order");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const { company } = data.userSession;
            const id = data.id;
            getOrderByIdDAO(id, function (err, order) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (order) {
                    if (order.company !== company){
                        const err = new Error("Only Company created this order can remove it");
                        waterfallCallback(err);
                    }
                    else if (order.status == "pending") {
                        removeOrderByIdDAO(id, waterfallCallback);
                    }
                    else {
                        const err = new Error("Only Pending Order can be removed");
                        waterfallCallback(err);
                    }
                }
                else {
                    const err = new Error("Order Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ], callback);
}

function compare(a,b){
    const idA = a.id;
    const idB = b.id;

    let comparision = 0;
    if (idA > idB) {
        comparision = 1;
    }
    else if (idA < idB){
        comparision = -1;
    }
    return comparision;
}

function getUserRoles(roles) {
    const isStoreManager = roles.indexOf("storeManager") >= 0;
    const isSales = roles.indexOf("sales") >= 0;
    return { isStoreManager, isSales }
}

export function getPendingOrders(callback) {
    getPendingOrdersDAO(callback);
}

export function getApprovedOrders(callback) {
    getApprovedOrdersDAO(callback);
}

export function getApprovedOrdersByCompany(company, callback) {
    getApprovedOrdersByCompanyDAO(company, callback);
}

export function getPendingOrderByCompany(company, callback) {
    getPendingOrderByCompanyDAO(company, callback);
}
