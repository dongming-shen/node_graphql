import mongoose, {Schema, Document} from 'mongoose';

export interface IQuestion extends Document {
    title: string;
    content: string;
    authorId: mongoose.Schema.Types.ObjectId; // Reference to User model
}

const QuestionSchema: Schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // Reference to User model
    // include any other fields your question model needs
}, {timestamps: true});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
