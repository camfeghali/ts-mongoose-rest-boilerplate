"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MySqlDriver {
    // getAll: (table: string) => object[];
    // getById: (id: any, table: string) => object;
    getAll(table) {
        return [{}];
    }
    getById(id, table) {
        return {};
    }
}
function mySqlDriverFactory() {
    return new MySqlDriver();
}
exports.default = mySqlDriverFactory;
