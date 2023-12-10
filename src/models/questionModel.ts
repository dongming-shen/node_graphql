import mongoose, {Schema, Document} from 'mongoose';

export interface IQuestion extends Document {
    title: string;
    content: string;
    authorId: string;
}

const QuestionSchema: Schema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    authorId: {type: String, required: true},
    // include any other fields your question model needs
}, {timestamps: true});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
