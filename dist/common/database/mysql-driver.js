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
const promise_1 = __importDefault(require("mysql2/promise"));
const debug_1 = __importDefault(require("debug"));
const log = (0, debug_1.default)('app:mysql-driver');
const mysqlOptions = {
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'demo',
};
const createUsersTableQuery = `
        CREATE TABLE if not exists users (
            id INT AUTO_INCREMENT NOT NULL, 
            email VARCHAR(50), 
            password VARCHAR(200), 
            firstName VARCHAR(50), 
            lastName VARCHAR(50), 
            permissionFlags INT,
            primary key (id)
        );
    `;
class MySqlDriver {
    constructor() {
        this.count = 0;
        // getAll = async (table: string, limit: number, page: number) => await [1];
        this.getById = (id, table) => 'any';
        this.getBy = (query, table) => 'any';
        this.update = (id, fields, table) => 'any';
        this.delete = (id, table) => '';
        this.connectWithRetry = () => {
            promise_1.default
                .createConnection(mysqlOptions)
                .then((conn) => {
                this.connection = conn;
            })
                .then(() => {
                return this.connection.query(createUsersTableQuery);
            })
                .then(() => {
                // @ts-ignore
                console.log('table created');
            })
                .catch((err) => {
                const retrySeconds = 5;
                log(`Mysql connection unsuccessful (will retry #${++this
                    .count} after ${retrySeconds} seconds):`, err.stack);
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
        };
        this.connectWithRetry();
    }
    getAll(table, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.connection
                .query(`select * from ${table}`)
                .then(([rows, result]) => {
                return rows;
            });
        });
    }
    insert(fields, table) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertFields = Object.keys(fields).join(', ');
            const insertValues = Object.keys(fields)
                // @ts-ignore
                .map((field) => `'${fields[field]}'`)
                .join(', ');
            return yield this.connection
                .query(`
                INSERT INTO ${table} (${insertFields}) VALUES (${insertValues}); 
                SELECT LAST_INSERT_ID();
                `)
                .then(([rows, result]) => {
                //@ts-ignore
                return rows;
            });
        });
    }
}
exports.default = new MySqlDriver();
