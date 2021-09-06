require("dotenv").config();

//frameworks
const express = require('express');
const mongoose = require('mongoose');

//Microservices Routes
const Book = require('./API/Book');
const Author = require('./API/Author');
const Publication = require('./API/Publication');

//database
let { books, authors, publications } = require('./database/index');

//Initialization express
const app = express();
app.use(express.json());


//Models
const BookModel = require('./database/book');
const AuthorModel = require('./database/author');
const PublicationModel = require('./database/publication');

//?---------------------------------------------------------------------------------------

//database connection establish
mongoose.connect(process.env.MONGO_URL).then(() => console.log("connection established"));
//! get all  

app.get('/', async (req, res) => {
    const books = await BookModel.find();
    const authors = await AuthorModel.find();
    const publications = await PublicationModel.find();

    res.json({ books: books, authors: authors, publications: publications });
});

//Microservices initialization
app.use('/book', Book);
app.use('/author', Author);
app.use('/publication', Publication);


//! listening port
app.listen('4000', () => console.log("server is running"));