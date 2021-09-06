const mongoose = require('mongoose');

//Creating a author schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [Number]
});

//Creating a author model
const AuthorModel = mongoose.model(AuthorSchema);

//exporting author model
module.exports = AuthorModel;