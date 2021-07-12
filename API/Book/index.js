const Router = require("express").Router();

const BookModel = require("../../database/book");

//API - to get all books
/* 
Route               /
Description         get all books
Access              public
Parameter           none
Methods             get
*/
Router.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

// to get specific books
/* 
Route               /
Description         get specific books based on isbn
Access              public
Parameter           isbn
Methods             get
*/
Router.get("/is/:isbn", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn})

    /*const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );*/
    if(!getSpecificBook){
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
Router.get("/c/:category", async (req, res) => {
    
    const getSpecificBook = await BookModel.findOne({category: req.params.category});
    /*const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );*/

    if(!getSpecificBook){
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

Router.get("/l/:language", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ language: req.params.language });
/*const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
);*/
if(!getSpecificBook){
    return res.json({
        error: `No book found for the language of ${req.params.language}`,
    });
}
return res.json({ book: getSpecificBook });

});

//API - to Add new book
/* 
Route               /book/add
Description         add new book
Access              public
Parameter           none
Methods             post
*/
Router.post("/add", async (req, res) => {
try{
    const { newBook } = req.body;

    const addNewBook = await BookModel.create(newBook);
    //database.books.push(newBook);
    return res.json({ books: addNewBook });
}catch(error){
    return res.json({ error: error.message });
}
});

//API - to update book title
/* 
Route               /book/update/title
Description         to update book title
Access              public
Parameter           isbn
Methods             put
*/

Router.put("/update/title/:isbn", async (req, res) =>{
    
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: req.body.bookTitle,
        },
        {
            new: true,
        }
        );
    // for each - directly update
    /*database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.title = req.body.newBookTitle;
            return;
        }
    });*/
    return res.json({ books: updatedBook });

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

Router.put("/update/author/:isbn", async (req, res) => {
    
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $push: {
                authors: req.body.newAuthor,
            },
        },
        {
            new: true,
        }
    );
    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor,
        },
        {
            $push: {
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );
    //update book database
    /*database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            return book.author.push(parseInt(req.params.authorId));
        }
    });*/
    //update author database

    /*database.author.forEach((author) =>{
        if(author.id === parseInt(req.params.authorId)){
            return author.books.push(req.params.isbn);
        }
    });*/

    return res.json({ books:updatedBook, authors: updatedAuthor });
});

//API - //To delete a book
/* 
Route               /book/delete
Description       to delete a book
Access              public
Parameter           isbn
Methods             DELETE  
*/

Router.delete("/delete/:isbn", async (req, res) =>{
    
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn,
        }
    );
    //deleting using filter
    /*const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );
    
    //new array

    database.books = updatedBookDatabase;*/
    return res.json({ books: updatedBookDatabase });
});

//API - To delete an author from a book
/* 
Route               /book/delete/author
Description         To delete an author from a book
Access              public
Parameter           isbn, authorId (parameter and parameter)
Methods             DELETE  
*/
Router.delete("/delete/author/:isbn/:authorId", async (req, res) =>{
    //update the book database

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $pull:{
                authors: parseInt(req.params.authorId),
            },
        },
        {
            new: true,
        }
    );
    //update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.params.authorId,
        },
        {
            $pull: {
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    );
    /*database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter(
            (author) => author !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });*/
    //update author database

    /*database.author.forEach((author) =>{
        if(author.id === parseInt(req.params.authorId)){
            const newBookList = author.books.filter(
                (book) => book !== req.params.isbn
            );
            author.books = newBookList;
            return;
        }
    });*/

    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "author was deleted"});
});


module.exports = Router;