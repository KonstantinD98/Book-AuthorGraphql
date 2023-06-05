import { Schema, model } from "mongoose";
const AuthorSchema = new Schema({
    name: { type: String, required: true },
});
AuthorSchema.index({ name: 1 });
export const Author = model('authors', AuthorSchema);
