const mongoose = require('mongoose');

//Creating a publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [Number]
});

//Creating a publication model
const PublicationModel = mongoose.model(PublicationSchema);

//exporting publication model
module.exports = PublicationModel;