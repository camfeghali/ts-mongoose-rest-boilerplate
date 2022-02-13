"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const mysql_driver_1 = __importDefault(require("../../common/database/mysql-driver"));
const log = (0, debug_1.default)('app:in-memory-dao');
class UsersDao {
    constructor(db) {
        this.table = 'users';
        log('Create a new instance of UserDao');
        this.db = db;
    }
    getUsers(limit = 25, page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getAll(this.table, limit, page);
        });
    }
    addUser(userFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.insert(userFields, this.table);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getBy({ email }, this.table);
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.getById(userId, this.table);
        });
    }
    updateUserById(userId, userFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.update(userId, userFields, this.table);
        });
    }
    removeUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.delete(userId, this.table);
        });
    }
}
// Singleton pattern powered by node caching,
// Any file importing users.dao.ts will be handed a reference to
// the exported new User() instance.
// this is a in-memory dao
exports.default = new UsersDao(mysql_driver_1.default);
