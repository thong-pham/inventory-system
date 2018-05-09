import async from "async";

import {
    createCart as createCartDAO,
    getPendingCarts as getPendingCartsDAO,
    getCartById as getCartByIdDAO,
    updateCartById as updateCartByIdDAO,
    getCartBySku as getCartBySkuDAO,
    removeCartById as removeCartByIdDAO,

} from "./../dao/mongo/impl/CartDAO";

import {
    getInventoryBySku as getInventoryBySkuDAO
} from "./../dao/mongo/impl/InventoryDAO";

import { getNextCartId } from "./CounterService";

import { getCompanyByName as getCompanyByNameDAO } from "./../dao/mongo/impl/CompanyDAO";

export function createCart(data, callback){
   async.waterfall([
     function(waterfallCallback){
        const { username } = data.userSession;
        getCartBySkuDAO(data.sku, function(err, cart){
            if (cart){
                if (cart.username === username)
                {
                    const err = new Error("SKU Already Exists");
                    waterfallCallback(err);
                }
                else {
                    waterfallCallback();
                }
            }
            else {
                waterfallCallback();
            }
        });
     },
     function (waterfallCallback){
        getNextCartId(function (err, counterDoc){
            waterfallCallback(err, data, counterDoc);
        });
     },
     function (data, counterDoc, waterfallCallback){
         const { username } = data.userSession;
         data.id = counterDoc.counter;
         data.username = username;
         createCartDAO(data, waterfallCallback);
     }
   ],callback);
}

export function updateCart(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const id = data.id;
            getCartByIdDAO(id, function (err, cart) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (cart) {
                    if (cart.status == "pending") {
                        var updateQuantity = cart.quantity + data.quantity
                        const update = {
                            quantity : updateQuantity
                        }
                        updateCartByIdDAO(id, update, waterfallCallback);
                    }
                    else {
                        const err = new Error("Only Pending Carts can be edited");
                        waterfallCallback(err);
                    }
                }
                else {
                    const err = new Error("Cart Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ], callback);
}

export function removeCart(data, callback){
    async.waterfall([
      function(waterfallCallback){
          const id = data.id;
          const { username } = data.userSession;
          getCartByIdDAO(id, function(err, cart){
              if (err){
                  waterfallCallback(err);
              }
              else{
                  if(cart.username !== username){
                      const err = new Error("You are not the one who create this cart");
                      waterfallCallback(err);
                  }
                  else{
                      removeCartByIdDAO(id, waterfallCallback);
                  }
              }
          });
      }
    ],callback);
}

export function getPendingCarts(username, callback) {
    getPendingCartsDAO(username, function(err, carts){
        if (err){
            callback(err);
        }
        else {
            var newCarts = [];
            var count = 0;
            carts.forEach(function(cart){
                getInventoryBySkuDAO(cart.mainSku, function(err, inventory){
                    if (err){
                        callback(err);
                    }
                    else if (inventory) {
                        cart.mainStock = inventory.stock;
                        newCarts.push(cart);
                        count += 1;
                          if (count === carts.length){
                              //console.log(newInv);
                              callback(null, newCarts);
                          }
                    }
                    else{
                        const err = new Error("Inventory Not Found")
                        callback(err);
                    }
                });
            });
        }
    });
}
