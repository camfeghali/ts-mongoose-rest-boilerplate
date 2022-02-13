export interface IDatabase {
    getAll: (table: string, limit: number, page: number) => Promise<any>;
    getById: (id: string, table: string) => any;
    insert: (fields: object, table: string) => any;
    getBy: (query: object, table: string) => any;
    update: (id: string, fields: object, table: string) => any;
    delete: (id: string, table: string) => any;
}
