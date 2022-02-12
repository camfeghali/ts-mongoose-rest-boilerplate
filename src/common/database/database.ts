export interface IDatabase {
    getAll: (table: string) => Array<object>;
    getById: (id: string, table: string) => object;
}

export class Database implements IDatabase {
    private driver: IDatabase;

    constructor(driver: IDatabase) {
        this.driver = driver;
    }

    public getAll(table: string) {
        return this.driver.getAll(table);
    }

    public getById(id: any, table: string) {
        return this.driver.getById(id, table);
    }
}

export default function databaseFactory(driver: IDatabase) {
    return new Database(driver);
}
