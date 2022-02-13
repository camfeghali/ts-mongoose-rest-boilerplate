import { IDatabase } from './database';
import mongoose from 'mongoose';
import debug from 'debug';
import shortid from 'shortid';

const log: debug.IDebugger = debug('app:mongoose-service');

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
};

class MongooseDriver implements IDatabase {
    private count = 0;

    Schema = mongoose.Schema;

    userSchema = new this.Schema(
        {
            _id: String,
            email: String,
            password: { type: String, select: false },
            firstName: String,
            lastName: String,
            permissionFlags: Number,
        },
        { id: false }
    );

    User = mongoose.model('users', this.userSchema);

    constructor() {
        this.connectWithRetry();
    }

    async getAll(table: string, limit: number, page: number) {
        return await mongoose
            .model(table)
            .find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async getById(id: string, table: string) {
        return await mongoose.model(table).findOne({ _id: id }).exec();
    }

    async getBy(query: object, table: string) {
        return await mongoose.model(table).findOne(query).exec();
    }

    async insert(fields: object, table: string) {
        let recordId = shortid.generate();
        let recordSchema = mongoose.model(table);
        let record = new recordSchema({
            _id: recordId,
            ...fields,
        });
        await record.save();
    }

    async update(id: string, fields: object, table: string) {
        const record = await mongoose
            .model(table)
            .findOneAndUpdate({ _id: id }, { $set: fields }, { new: true })
            .exec();
        return record;
    }

    async delete(id: string, table: string) {
        return mongoose.model(table).deleteOne({ _id: id }).exec();
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)');
        mongoose
            .connect('mongodb://localhost:27017/api-db', mongooseOptions)
            .then(() => {
                log('MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}

export default new MongooseDriver();
