import mysql from 'mysql2/promise';
import { IDatabase } from './database';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mysql-driver');

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

class MySqlDriver implements IDatabase {
    private count = 0;
    private connection!: mysql.Connection;
    constructor() {
        this.connectWithRetry();
    }

    async getAll(table: string, limit: number, page: number) {
        return await this.connection
            .query(`select * from ${table}`)
            .then(([rows, result]) => {
                return rows;
            });
    }

    async insert(fields: object, table: string) {
        const insertFields = Object.keys(fields).join(', ');
        const insertValues = Object.keys(fields)
            // @ts-ignore
            .map((field) => `'${fields[field]}'`)
            .join(', ');

        return await this.connection
            .beginTransaction()
            .then(async () => {
                return await this.connection
                    .query(
                        `
                    INSERT INTO ${table} (${insertFields}) VALUES (${insertValues});
                    `
                    )
                    .then(async () => {
                        return await this.connection.query(
                            `SELECT LAST_INSERT_ID();`
                        );
                    });
            })
            .then(([rows, result]) => {
                //@ts-ignore
                return rows[0]['LAST_INSERT_ID()'];
            });
    }

    // getAll = async (table: string, limit: number, page: number) => await [1];
    getById = (id: string, table: string) => 'any';
    getBy = (query: object, table: string) => 'any';
    update = (id: string, fields: object, table: string) => 'any';
    delete = (id: string, table: string) => '';

    connectWithRetry = () => {
        mysql
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
                log(
                    `Mysql connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err.stack
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}

export default new MySqlDriver();
