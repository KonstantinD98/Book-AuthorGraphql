import { Schema, model } from 'mongoose';
const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
    },
});
const Book = model('Book', bookSchema);
export default Book;
