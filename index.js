const express = require("express");

//Importing Database
const database = require("./database");

//Initialization
const booky = express();

booky.use(express.json());

//where data- so we need database - created database.js


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
Route               /book/add
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
Route               /book/add
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
Parameter           isbn
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
    database.publication.forEach((publication) =>{
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

booky.listen(3000, () => console.log("Hey my server is running"));