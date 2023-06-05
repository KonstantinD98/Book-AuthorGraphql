import { Schema, model, Document, Model } from "mongoose";

export interface IAuthor extends Document {
  name: string;
}

const AuthorSchema: Schema<IAuthor> = new Schema<IAuthor>({
  name: { type: String, required: true },
});

AuthorSchema.index({ name: 1 });

export const Author: Model<IAuthor> = model<IAuthor>('authors', AuthorSchema);
