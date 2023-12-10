"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connect = () => {
    mongoose_1.default.connect('mongodb://localhost:27017/mydatabase', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
    })
        .then(() => console.log("Connected successfully to MongoDB"))
        .catch(err => console.error('MongoDB connection error:', err));
    const db = mongoose_1.default.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};
exports.connect = connect;
