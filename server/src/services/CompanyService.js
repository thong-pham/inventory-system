import async from "async";
import config from "config";

import { getNextCompanyId } from "./CounterService";
import {
    createCompany as createCompanyDAO,
    getCompanyById as getCompanyByIdDAO,
    getCompanies as getCompaniesDAO,
    getCompanyByCode as getCompanyByCodeDAO,
    getCompanyByName as getCompanyByNameDAO,
} from "./../dao/mongo/impl/CompanyDAO";


export function createCompany(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
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
        },
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


export function getCompanyById(id, callback) {
    getCompanyByIdDAO(id, callback);
}

export function getCompanies(callback) {
    getCompaniesDAO(callback);
}
