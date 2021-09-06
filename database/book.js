const mongoose = require('mongoose');

//Creating a book schema
const BookSchema = mongoose.Schema({
    title: String,
    ISBN: Number,
    author: [Number],
    language: String,
    numberOfPages: Number,
    publication: Number,
    category: [String],
});

//Creating a book model
const BookModel = mongoose.model(BookSchema);

//exporting book model
module.exports = BookModel;