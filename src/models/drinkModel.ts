import mongoose, {Schema, Document} from 'mongoose';

export interface IDrink extends Document {
    name: string;
    description: string;
    timeToMake: number;
}

const DrinkSchema: Schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    timeToMake: {type: Number, required: true},
});

export const Drink = mongoose.model<IDrink>('Drink', DrinkSchema);
