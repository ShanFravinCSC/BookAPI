const mongoose = require("mongoose");

//Creating book Schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 10,
    },
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numPage: Number,
    category: [String],
    publications: Number,
});

//Create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;