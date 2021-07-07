const mongoose = require("mongoose");

//Crreating book Schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numPage: Number,
    category: [String],
    publications: Number,
});

//Create a book model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;