import { IDatabase } from './database';

class MySqlDriver implements IDatabase {
    // getAll: (table: string) => object[];
    // getById: (id: any, table: string) => object;

    getAll(table: string) {
        return [{}];
    }

    getById(id: string, table: string) {
        return {};
    }
}

export default function mySqlDriverFactory(): MySqlDriver {
    return new MySqlDriver();
}
