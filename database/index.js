require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

//Importing Database
const database = require("./database");

//Initialization
const booky = express();

booky.use(express.json());

//where data- so we need database - created database.js


//establish database connection
mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log("connection established!!!!!!!"));

//API - to get all books
/* 
Route               /
Description         get all books
Access              public
Parameter           none
Methods             get
*/
booky.get("/", (req, res) => {
    return res.json({ books: database.books });
});

// to get specific books
/* 
Route               /
Description         get specific books based on isbn
Access              public
Parameter           isbn
Methods             get
*/
booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );
    if(getSpecificBook.length === 0){
        return res.json({
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }
    return res.json({ book: getSpecificBook });
});

// to get list of books based on category
/* 
Route               /c
Description         get list of specificbooks based on category
Access              public
Parameter           category
Methods             get
*/
booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if(getSpecificBook.length === 0){
        return res.json({
            error: `No book found for category of ${req.params.category}`,
        });
        return res.json( {book: getSpecificBook});
    }
});
//to get list of Specificbooks based on languages
/* 
Route               /l
Description         get list of specificbooks based on language
Access              public
Parameter           language
Methods             get
*/

booky.get("/l/:language", (req, res) => {
const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
);
if(getSpecificBook.length === 0){
    return res.json({
        error: `No book found for the language of ${req.params.language}`,
    });
}
return res.json({ book: getSpecificBook });

});

//to get all authors
/* 
Route               /author
Description         get all authors
Access              public
Parameter           none
Methods             get
*/
booky.get("/author", (req, res) => {
    return res.json({ authors: database.author});
});

//to get specific author
/* 
Route               /author
Description         get specific author
Access              public
Parameter           id
Methods             get
*/

booky.get("/author/:id", (req, res) =>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === req.params.id
    );

    if(getSpecificAuthor.length === 0){
        return res.json({
            error: `No Author found for the id of ${req.params.id}`,
        });
    }
    return res.json({ author: getSpecificAuthor })
});

//to get specific author
/* 
Route               /author/book
Description         get specific author based on books
Access              public
Parameter           isbn
Methods             get
*/

booky.get("/author/book/:isbn", (req, res) =>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({
            error: `No Author found for the book of ${req.params.isbn}`,
        });
    }
    return res.json({ author: getSpecificAuthor});
});

//to get all publications
/* 
Route               /publication
Description         get all publications
Access              public
Parameter           none
Methods             get
*/
booky.get("/publication", (req, res) => {
    return res.json({ publications: database.publication});
});

//to get specific publication
/* 
Route               /publication
Description         get specific publication
Access              public
Parameter           id
Methods             get
*/

booky.get("/publication/:id", (req, res) =>{
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id === req.params.id
    );
    if(getSpecificPublication.length === 0){
        return res.json({
            error: `No Publication found for the id of ${req.params.id}`,
        });
    }
    return res.json({ publication: getSpecificPublication });
});

//to get specific publication based on book
/* 
Route               /publication/book
Description         get specific publication based on book
Access              public
Parameter           isbn
Methods             get
*/

booky.get("/publication/book/:isbn", (req, res) =>{
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if(getSpecificPublication.length === 0){
        return res.json({
            error: `No Publication found for the book of ${req.params.isbn}`,
        });
    }
    return res.json({ author: getSpecificPublication});
});

//API - to Add new book
/* 
Route               /book/add
Description         add new book
Access              public
Parameter           none
Methods             post
*/
booky.post("/book/add", (req, res) => {
    const { newBook } = req.body;

    database.books.push(newBook);
    return res.json({ books: database.books });
});

//API - to Add new author
/* 
Route               /author/add
Description         add new author
Access              public
Parameter           none
Methods             post
*/
booky.post("/author/add", (req, res) => {
    const { newAuthor } = req.body;

    database.author.push(newAuthor);
    return res.json({ author: database.author });
});

//API - to Add new publication
/* 
Route               /publication/add
Description         add new publication
Access              public
Parameter           none
Methods             post
*/
booky.post("/publication/add", (req, res) => {
    const { newPublication } = req.body;

    database.publication.push(newPublication);
    return res.json({ publication: database.publication });
});

//API - to update book title
/* 
Route               /book/update/title
Description         to update book title
Access              public
Parameter           isbn
Methods             put
*/

booky.put("/book/update/title/:isbn", (req, res) =>{
    // for each - directly update
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.title = req.body.newBookTitle;
            return;
        }
    });
    return res.json({ books: database.books });

    //map - not directly
});

//API - //update / add new author for a book
/* 
Route               /book/update/author
Description        update / add new author for a book
Access              public
Parameter           isbn/authorId
Methods             put
*/

booky.put("/book/update/author/:isbn/:authorId", (req, res) => {
    //update book database

    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            return book.author.push(parseInt(req.params.authorId));
        }
    });
    //update author database

    database.author.forEach((author) =>{
        if(author.id === parseInt(req.params.authorId)){
            return author.books.push(req.params.isbn);
        }
    });
    return res.json({ books:database.books, author: database.author });
});

//API - to update author name using it's id

/* 
Route               /author/update/name
Description         update author name using it's id
Access              public
Parameter           id
Methods             put
*/
booky.put("/author/update/name/:authorId", (req, res) => {
    database.author.forEach((author)=>{
        if(author.id === parseInt(req.params.authorId)){
            author.name = req.body.newAuthorName;
            return;
    }
});
    return res.json({ author: database.author });
});

//API - to update publication name using it's id

/* 
Route               /publication/update/name
Description         update publication name using it's id
Access              public
Parameter           id
Methods             put
*/
booky.put("/publication/update/name/:publicationId", (req, res) => {
    database.publication.forEach((publication)=>{
        if(publication.id === parseInt(req.params.publicationId)){
            publication.name = req.body.newPublicationName;
            return;
    }
});
    return res.json({ publication: database.publication });
});

//API - to update/add new book to a publication

/* 
Route               /publication/update/book
Description         to update/add new book to a publication
Access              public
Parameter           isbn
Methods             put
*/
booky.put("/publication/update/book/:isbn", (req, res) =>{
    //update publication database
    database.publication.forEach((publication) => {
        if(publication.id === req.body.pubId){
            return publication.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({
        books: database.books,
        publication: database.publication,
        message: "Successfully updated publication", 
    });
});

//API - //To delete a book
/* 
Route               /book/delete
Description       to delete a book
Access              public
Parameter           isbn
Methods             DELETE  
*/

booky.delete("/book/delete/:isbn", (req, res) =>{
    //deleting using filter
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );
    
    //new array

    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
});

//API - To delete an author from a book
/* 
Route               /book/delete/author
Description         To delete an author from a book
Access              public
Parameter           isbn, authorId (parameter and parameter)
Methods             DELETE  
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req, res) =>{
    //update the book database

    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter(
            (author) => author !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });
    //update author database

    database.author.forEach((author) =>{
        if(author.id === parseInt(req.params.authorId)){
            const newBookList = author.books.filter(
                (book) => book !== req.params.isbn
            );
            author.books = newBookList;
            return;
        }
    });
    return res.json({
        book: database.books,
        author: database.author,
        message: "author was deleted"});
});

//API - //To delete an author
/* 
Route               /author/delete
Description       to delete an author
Access              public
Parameter           authorId
Methods             DELETE  
*/

booky.delete("/author/delete/:authorId", (req, res) =>{
    const updatedAuthorDatabase = database.author.filter(
        (author) => author.id !== parseInt(req.params.authorId)
    );

    database.author = updatedAuthorDatabase;
    return res.json({ author: database.author});
});

//API - //To delete a publication
/* 
Route               /publication/delete
Description       to delete a publication
Access              public
Parameter           pubId
Methods             DELETE  
*/

booky.delete("/publication/delete/:pubId", (req, res) =>{
    const updatedPublicationDatabase = database.publication.filter(
        (publication) => publication.id !== parseInt(req.params.pubId)
    );

    database.publication = updatedPublicationDatabase;
    return res.json({ publication: database.publication});
});
//API - //To delete a book from publication
/* 
Route               /publication/delete/book
Description       to delete a book from publication
Access              public
Parameter           isbn, pubId
Methods             DELETE  
*/



booky.delete("/publication/delete/book/:isbn/:pubId", (req, res) =>{
    // update book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publications = 0;
            return;
        }
    });
    //update publication database

    database.publication.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)){
            const newBookList = publication.books.filter(
                (book) => book !== req.params.isbn
            );
            publication.books = newBookList;
            return;
        }
    });
    return res.json({
        books: database.books,
        publication: database.publication,
        message: "publication was deleted"});
});

booky.listen(3000, () => console.log("Hey my server is running"));

//agent should 
//Talk to mongoDB in way mongodb understands &&
//talk to us in a way we understand