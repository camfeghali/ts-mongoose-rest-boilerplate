import UsersDao from '../daos/users.dao';
import { CRUD } from '../../common/crud.interfaces';
import { CreateUserDto, PutUserDto, PatchUserDto } from '../dto';

class UsersService implements CRUD {
    async create(resource: CreateUserDto) {
        return UsersDao.addUser(resource);
    }
    async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    }
    async list(limit: number, page: number) {
        return UsersDao.getUsers();
    }
    async patchById(id: string, resource: PatchUserDto) {
        return UsersDao.updateUserById(id, resource);
    }
    async readById(id: string) {
        return UsersDao.getUserById(id);
    }
    async putById(id: string, resource: PutUserDto) {
        return UsersDao.updateUserById(id, resource);
    }
    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }
}

// Singleton pattern powered by node caching,
// Any file importing users.dao.ts will be handed a reference to
// the exported new UsersService() instance.
// this is essentially a in-memory service
export default new UsersService();
