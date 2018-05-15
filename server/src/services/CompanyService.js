import async from "async";
import config from "config";

import { getNextCompanyId } from "./CounterService";
import {
    createCompany as createCompanyDAO,
    getCompanyById as getCompanyByIdDAO,
    getCompanies as getCompaniesDAO,
    getCompanyByCode as getCompanyByCodeDAO,
    getCompanyByName as getCompanyByNameDAO,
    updateCompanyById as updateCompanyByIdDAO,
    removeCompanyById as removeCompanyByIdDAO
} from "./../dao/mongo/impl/CompanyDAO";


export function createCompany(data, callback) {
    async.waterfall([
        /*function (waterfallCallback) {
            getCompanyByCodeDAO(data.code, waterfallCallback);
        },
        function (company, waterfallCallback) {
            if (company) {
                var err = new Error("Code Already Exists");
                waterfallCallback(err);
            }
            else {
                waterfallCallback();
            }
        },*/
        function (waterfallCallback) {
            getCompanyByNameDAO(data.name.en, waterfallCallback);
        },
        function (company, waterfallCallback) {
            if (company) {
                var err = new Error("Name Already Exists");
                waterfallCallback(err);
            }
            else {
                waterfallCallback();
            }
        },
        function (waterfallCallback) {
            getNextCompanyId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            data.id = counterDoc.counter;
            createCompanyDAO(data, waterfallCallback);
        }
    ], callback);
}

export function editCompany(data, callback) {
    async.waterfall([
        function(waterfallCallback){
            const { roles } = data.userSession;
            const { isAdmin } = getUserRoles(roles);
            if (isAdmin){
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to edit Company");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            getCompanyByIdDAO(data.id, function(err, company){
                  if (err){
                      waterfallCallback(err);
                  }
                  else if (company) {
                      waterfallCallback(null, company);
                  }
                  else {
                      const err = new Error("Company Not Found");
                      waterfallCallback(err);
                  }
            });
        },
        function (company, waterfallCallback) {
            const update = {
                name: data.name,
            }
            updateCompanyByIdDAO(data.id, update, waterfallCallback);
        }
    ], callback);
}

export function removeCompany(data, callback){
    async.waterfall([
        function(waterfallCallback){
            const { roles } = data.userSession;
            const { isAdmin } = getUserRoles(roles);
            if (isAdmin){
                waterfallCallback();
            }
            else{
                const err = new Error("Not Enough Permission to remove Company");
                waterfallCallback(err);
            }
        },
        function(waterfallCallback){
            const id = data.id;
            getCompanyByIdDAO(id, function(err, company){
                if (err){
                    waterfallCallback(err);
                }
                else if (company){
                    removeCompanyByIdDAO(id, waterfallCallback);
                }
                else {
                    const err = new Error("Company Not Found");
                    waterfallCallback(err);
                }
            });
        }
    ],callback)
}

export function getCompanyById(id, callback) {
    getCompanyByIdDAO(id, callback);
}

export function getCompanies(callback) {
    getCompaniesDAO(callback);
}

function getUserRoles(roles) {
    const isAdmin = roles.indexOf("admin") >= 0;
    return { isAdmin };
}
