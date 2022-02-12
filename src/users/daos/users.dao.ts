import { CreateUserDto, PutUserDto, PatchUserDto } from "../dto";
import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug("app:in-memory-dao")
const allowedPatchFields = [
    "password",
    "firstName",
    "lastName",
    "permissionLevel"
]

class UsersDao {
    users: Array<CreateUserDto> = [];

    constructor(){
        log("Create a new instance of User")
    }

    async addUser(user: CreateUserDto) {
        user.id = shortid.generate();
        this.users.push(user);
        return user.id;
    }

    async getUsers() {
        return this.users;
    }

    async getUserById(userId: string) {
        return this.users.find((user) => user.id === userId)
    }

    async putUserById(userId: string, user: PutUserDto) {
        const objIndex = this.findObjIndex(userId);
        this.users.splice(objIndex, 1), user;
        return `user ${user.id} updated via put`
    }

    async patchUserById(userId: string, user: PatchUserDto) {
        const objIndex = this.findObjIndex(userId);
        let currentUser = this.users[objIndex];
        for (let field of allowedPatchFields) {
            if (field in user) {
                // @ts-ignore
                currentUser[field] = user[field];
            }
        }
        this.users.splice(objIndex, 1, currentUser);
        return `user ${user.id} patched`
    }

    async removeUserById(userId: string) {
        const objIndex = this.findObjIndex(userId);
        this.users.splice(objIndex, 1);
        return `${userId} removed`;
    }

    async getUserByEmail(email: string) {
        const objIndex = this.users.findIndex(
            (obj: { email: string }) => obj.email === email
        );    
        let currentUser = this.users[objIndex];
        if (currentUser) {
            return currentUser;
        } else {
            return null;
        }
    }

    private findObjIndex(userId: string) {
        return this.users.findIndex(
            (obj: CreateUserDto) => obj.id === userId
        )
    }

}

// Singleton pattern powered by node caching,
// Any file importing users.dao.ts will be handed a reference to
// the exported new User() instance.
// this is a in-memory dao
export default new UsersDao()