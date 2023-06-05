import { Document, Schema, model } from 'mongoose';
import { IAuthor } from './author';

export interface IBook extends Document {
  title: string;
  authorId: Schema.Types.ObjectId;
  year: number;
  author: IAuthor;
}

const bookSchema = new Schema<IBook>({
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

const Book = model<IBook>('Book', bookSchema);

export default Book;
