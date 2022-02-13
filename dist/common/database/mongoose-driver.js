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
const mongoose_1 = __importDefault(require("mongoose"));
const debug_1 = __importDefault(require("debug"));
const shortid_1 = __importDefault(require("shortid"));
const log = (0, debug_1.default)('app:mongoose-service');
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
};
class MongooseDriver {
    constructor() {
        this.count = 0;
        this.Schema = mongoose_1.default.Schema;
        this.userSchema = new this.Schema({
            _id: String,
            email: String,
            password: { type: String, select: false },
            firstName: String,
            lastName: String,
            permissionFlags: Number,
        }, { id: false });
        this.User = mongoose_1.default.model('users', this.userSchema);
        this.connectWithRetry = () => {
            log('Attempting MongoDB connection (will retry if needed)');
            mongoose_1.default
                .connect('mongodb://localhost:27017/api-db', mongooseOptions)
                .then(() => {
                log('MongoDB is connected');
            })
                .catch((err) => {
                const retrySeconds = 5;
                log(`MongoDB connection unsuccessful (will retry #${++this
                    .count} after ${retrySeconds} seconds):`, err);
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
        };
        this.connectWithRetry();
    }
    getAll(table, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoose_1.default
                .model(table)
                .find()
                .limit(limit)
                .skip(limit * page)
                .exec();
        });
    }
    getById(id, table) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoose_1.default.model(table).findOne({ _id: id }).exec();
        });
    }
    getBy(query, table) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoose_1.default.model(table).findOne(query).exec();
        });
    }
    insert(fields, table) {
        return __awaiter(this, void 0, void 0, function* () {
            let recordId = shortid_1.default.generate();
            let recordSchema = mongoose_1.default.model(table);
            let record = new recordSchema(Object.assign({ _id: recordId }, fields));
            yield record.save();
        });
    }
    update(id, fields, table) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoose_1.default
                .model(table)
                .findOneAndUpdate({ _id: id }, { $set: fields }, { new: true })
                .exec();
        });
    }
    delete(id, table) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongoose_1.default.model(table).deleteOne({ _id: id }).exec();
        });
    }
}
exports.default = new MongooseDriver();
