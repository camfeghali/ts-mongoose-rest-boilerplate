export interface IDatabase {
    getAll: (table: string, limit: number, page: number) => Promise<Array<any>>;
    getById: (id: string, table: string) => any;
    insert: (fields: object, table: string) => any;
    getBy: (query: object, table: string) => any;
    update: (id: string, fields: object, table: string) => any;
    delete: (id: string, table: string) => any;
}

// export class Database implements IDatabase {
//     private driver: IDatabase;

//     constructor(driver: IDatabase) {
//         this.driver = driver;
//     }

//     public getAll(table: string, limit: number, page: number) {
//         return this.driver.getAll(table, limit, page);
//     }

//     public getById(id: any, table: string) {
//         return this.driver.getById(id, table);
//     }

//     public insert(fields: object, table: string) {
//         this.driver.insert(fields, table);
//     }
// }

// export default function databaseFactory(driver: IDatabase) {
//     return new Database(driver);
// }
