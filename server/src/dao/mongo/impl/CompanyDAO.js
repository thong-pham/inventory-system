import mongoose from "mongoose";
import Company from "./../schema/CompanySchema";

export function createCompany(data, callback) {
    const companyModel = new Company(data);
    companyModel.save(function (err, user) {
        callback(err, user);
    });
}

export function getCompanyById(id, callback) {
    Company.findOne({ "id": parseInt(id) }, function (err, user) {
        callback(err, user)
    });
}

export function getCompanies(callback) {
    Company.find({}, function (err, users) {
        callback(err, users)
    });
}

export function getCompanyByCode(code, callback) {
    Company.findOne({ "code": code }, function (err, company) {
        callback(err, company)
    });
}

export function getCompanyByName(name, callback) {
    Company.findOne({ "name.en" : name }, function (err, company) {
        callback(err, company)
    });
}

export function updateCompanyById(id, data, callback) {
    data.lastModifiedAt = new Date();
    Company.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, user) {
        callback(err, user);
    });
}
