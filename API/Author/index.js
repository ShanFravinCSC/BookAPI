const Router = require("express").Router();

const AuthorModel = require("../../database/author");

//to get all authors
/* 
Route               /author
Description         get all authors
Access              public
Parameter           none
Methods             get
*/
Router.get("/", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ authors: getAllAuthors});
});

//to get specific author
/* 
Route               /author
Description         get specific author
Access              public
Parameter           id
Methods             get
*/

Router.get("/:id", async (req, res) =>{
    
    const getSpecificAuthor = await AuthorModel.findOne({ id: req.params.id});
    /*const getSpecificAuthor = database.author.filter(
        (author) => author.id === req.params.id
    );*/

    if(!getSpecificAuthor){
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

Router.get("/book/:isbn", async (req, res) =>{
    
    const getSpecificAuthor = await AuthorModel.findOne({ books: req.params.isbn });
    /*const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );*/

    if(!getSpecificAuthor){
        return res.json({
            error: `No Author found for the book of ${req.params.isbn}`,
        });
    }
    return res.json({ author: getSpecificAuthor});
});

//API - to Add new author
/* 
Route               /author/add
Description         add new author
Access              public
Parameter           none
Methods             post
*/
Router.post("/add", (req, res) => {
    const { newAuthor } = req.body;

    const addNewAuthor = AuthorModel.create(newAuthor);
    //database.author.push(newAuthor);
    return res.json({ author: addNewAuthor });
});

//API - to update author name using it's id

/* 
Route               /author/update/name
Description         update author name using it's id
Access              public
Parameter           id
Methods             put
*/
Router.put("/update/name/:authorId", async (req, res) => {
    
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.params.authorId,
        },
        {
            name: req.body.newAuthorName,
        },
        {
            new: true,
        }
    );

    /*database.author.forEach((author)=>{
        if(author.id === parseInt(req.params.authorId)){
            author.name = req.body.newAuthorName;
            return;
    }
});*/
    return res.json({ author: updatedAuthor });
});

//API - //To delete an author
/* 
Route               /author/delete
Description       to delete an author
Access              public
Parameter           authorId
Methods             DELETE  
*/

Router.delete("/delete/:authorId", async (req, res) =>{
    
    const updatedAuthor = await AuthorModel.findOneAndDelete(
        {
            id: req.params.authorId,
        }
    )
    /*const updatedAuthorDatabase = database.author.filter(
        (author) => author.id !== parseInt(req.params.authorId)
    );

    database.author = updatedAuthorDatabase;*/
    return res.json({ author: updatedAuthor});
});

module.exports = Router;