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
const log = (0, debug_1.default)('app:in-memory-dao');
class UsersDao {
    constructor(db) {
        log('Create a new instance of UserDao');
        this.db = db;
    }
    // Schema = mongooseService.getMongoose().Schema;
    // userSchema = new this.Schema(
    //     {
    //         _id: String,
    //         email: String,
    //         password: { type: String, select: false },
    //         firstName: String,
    //         lastName: String,
    //         permissionFlags: Number,
    //     },
    //     { id: false }
    // );
    // User = mongooseService.getMongoose().model('Users', this.userSchema);
    // async addUser(userFields: CreateUserDto) {
    //     const userId = shortid.generate();
    //     const user = new this.User({
    //         _id: userId,
    //         ...userFields,
    //         permissionFlags: 1,
    //     });
    //     await user.save();
    //     return userId;
    // }
    // async getUserByEmail(email: string) {
    //     return this.User.findOne({ email: email }).exec();
    // }
    // async getUserById(userId: string) {
    //     return this.User.findOne({ _id: userId }).exec();
    // }
    getUsers(limit = 25, page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.getAll('users', limit, page);
        });
    }
}
// Singleton pattern powered by node caching,
// Any file importing users.dao.ts will be handed a reference to
// the exported new User() instance.
// this is a in-memory dao
exports.default = new UsersDao();
