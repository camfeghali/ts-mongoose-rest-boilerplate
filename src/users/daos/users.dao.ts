import { CreateUserDto, PutUserDto, PatchUserDto } from '../dto';
import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';
import { IDatabase } from '../../common/database/database';
import MongooseDriver from '../../common/database/mongoose-driver';

const log: debug.IDebugger = debug('app:in-memory-dao');

export interface IModel {
    table: string;
    db: IDatabase;
}

class UsersDao implements IModel {
    public table = 'users';
    db: IDatabase;

    constructor(db: IDatabase) {
        log('Create a new instance of UserDao');
        this.db = db;
    }

    async getUsers(limit = 25, page = 0) {
        return await this.db.getAll(this.table, limit, page);
    }

    async addUser(userFields: CreateUserDto) {
        return await this.db.insert(userFields, this.table);
    }

    async getUserByEmail(email: string) {
        return await this.db.getBy({ email }, this.table);
    }

    async getUserById(userId: string) {
        return await this.db.getById(userId, this.table);
    }

    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        return await this.db.update(userId, userFields, this.table);
    }

    async removeUserById(userId: string) {
        return this.db.delete(userId, this.table);
    }
}

// Singleton pattern powered by node caching,
// Any file importing users.dao.ts will be handed a reference to
// the exported new User() instance.
// this is a in-memory dao
export default new UsersDao(MongooseDriver);
