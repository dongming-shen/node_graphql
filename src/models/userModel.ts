import mongoose, {Schema, Document} from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string; // Adding email field
    // You can add more fields as needed
}

const UserSchema: Schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}, // Adding email field
    // Add more fields to the schema as needed
}, {timestamps: true});

export const User = mongoose.model<IUser>('User', UserSchema);
