import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { gql } from 'apollo-server';

import { connect } from 'mongoose';
import Book, { IBook } from '../models/book.js';
import { Author, IAuthor } from '../models/author.js';

const MONGODB = 'mongodb+srv://konstantin:konstantin@cluster0.g2vmwdz.mongodb.net/Books?retryWrites=true&w=majority';


const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    year: Int!
  }

  input BookInput {
    title: String!
    authorId: ID!
    year: Int!
  }

  type Query {
    getAuthor(id: ID!): Author
    getAllAuthors: [Author!]!
    getBook(id: ID!): Book
    getAllBooks: [Book!]!
    getBooks(limit: Int): [Book!]!
  }

  type Mutation {
    createAuthor(name: String!): Author
    updateAuthor(id: ID!, name: String!): Author
    deleteAuthor(id: ID!): ID
    createBook(bookInput: BookInput!): Book
    updateBook(id: ID!, title: String!): Book
    deleteBook(id: ID!): ID
  }
`;

const resolvers = {
  Query: {
    getAuthor: async (_: any, { id }: { id: string }) => {
      return await Author.findById(id);
    },
    getAllAuthors: async () => {
      return await Author.find();
    },
    getBook: async (_: any, { id }: { id: string }) => {
      return await Book.findById(id);
    },
    getAllBooks: async () => {
      return await Book.find();
    },
    getBooks: async (_: any, { limit }: { limit?: number }) => {
      if (limit) {
        return await Book.find().limit(limit);
      }
      return await Book.find();
    },
  },
  Mutation: {
    createAuthor: async (_: any, { name }: { name: string }) => {
      const author = new Author({ name });
      await author.save();
      return author;
    },
    updateAuthor: async (_: any, { id, name }: { id: string, name: string }) => {
      return await Author.findByIdAndUpdate(id, { name }, { new: true });
    },
    deleteAuthor: async (_: any, { id }: { id: string }) => {
      await Book.deleteMany({ authorId: id });
      await Author.findByIdAndDelete(id);
      return id;
    },
    createBook: async (_: any, { bookInput }: { bookInput: any }) => {
      const book = new Book(bookInput);
    
      const author = await Author.findById(bookInput.authorId);
      if (!author) {
        throw new Error('Author not found');
      }
    
      book.authorId = bookInput.authorId;
      book.author = bookInput.authorId;
    
      await book.save();
      return book;
    },
    updateBook: async (_: any, { id, title }: { id: string, title: string }) => {
      return await Book.findByIdAndUpdate(id, { title }, { new: true });
    },
    deleteBook: async (_: any, { id }: { id: string }) => {
      await Book.findByIdAndDelete(id);
      return id;
    },
  },
  Book: {
    author: async (book: IBook) => {
      const author = await Author.findById(book.authorId);
      if (!author) {
        throw new Error('Author not found');
      }
      return author;
    },
  },
  Author: {
    books: async (author: IAuthor) => {
      return await Book.find({ authorId: author.id });
    },
  },
};

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app });

  connect(MONGODB)
    .then(() => {
      app.listen({ port: 4000 }, () => {
        console.log(`Server is ready at http://localhost:4000${server.graphqlPath}`);
      });
    })
    .catch((error) => {
      console.log(`Error connecting to the database: ${error}`);
    });
});