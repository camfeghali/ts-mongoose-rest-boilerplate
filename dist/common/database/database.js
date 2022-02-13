"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
class Database {
    constructor(driver) {
        this.driver = driver;
    }
    getAll(table, limit, page) {
        return this.driver.getAll(table, limit, page);
    }
    getById(id, table) {
        return this.driver.getById(id, table);
    }
}
exports.Database = Database;
function databaseFactory(driver) {
    return new Database(driver);
}
exports.default = databaseFactory;
