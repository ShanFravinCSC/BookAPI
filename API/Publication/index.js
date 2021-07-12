const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

//to get all publications
/* 
Route               /publication
Description         get all publications
Access              public
Parameter           none
Methods             get
*/
Router.get("/", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({ publications: getAllPublications });
});

//to get specific publication
/* 
Route               /publication
Description         get specific publication
Access              public
Parameter           id
Methods             get
*/

Router.get("/:id", async (req, res) =>{
    
    const getSpecificPublication = await PublicationModel.findOne({ id: req.params.id })
    /*const getSpecificPublication = database.publication.filter(
        (publication) => publication.id === req.params.id
    );*/
    if(!getSpecificPublication){
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

Router.get("/book/:isbn", async (req, res) =>{
    
    const getSpecificPublication = await PublicationModel.findOne({ books: req.params.isbn});
    /*const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );*/

    if(!getSpecificPublication){
        return res.json({
            error: `No Publication found for the book of ${req.params.isbn}`,
        });
    }
    return res.json({ publication: getSpecificPublication});
});





//API - to Add new publication
/* 
Route               /publication/add
Description         add new publication
Access              public
Parameter           none
Methods             post
*/
Router.post("/add", (req, res) => {
    const { newPublication } = req.body;

    const addNewPublication = PublicationModel.create(newPublication)
    //database.publication.push(newPublication);
    return res.json({ publication: addNewPublication });
});





//API - to update publication name using it's id

/* 
Route               /publication/update/name
Description         update publication name using it's id
Access              public
Parameter           id
Methods             put
*/
Router.put("/update/name/:publicationId", async (req, res) => {
    
    
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.params.publicationId,
        },
        {
            name: req.body.newPublicationName,
        },
        {
            new: true,
        }
    );
    /*database.publication.forEach((publication)=>{
        if(publication.id === parseInt(req.params.publicationId)){
            publication.name = req.body.newPublicationName;
            return;
    }
});*/
    return res.json({ publication: updatedPublication });
});

//API - to update/add new book to a publication

/* 
Route               /publication/update/book
Description         to update/add new book to a publication
Access              public
Parameter           isbn
Methods             put
*/
Router.put("/update/book/:isbn", async (req, res) =>{
    
    //update publication database
    const updatedPublicationDatabase = await PublicationModel.findOneAndUpdate(
        {
            id: req.body.newPublication,
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

    //update the book database

    const updatedBookDatabase = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            publications: req.body.newPublication,
        },
        {
            new: true,
        }
    );
    //update publication database
    /*database.publication.forEach((publication) => {
        if(publication.id === req.body.pubId){
            return publication.books.push(req.params.isbn);
        }
    });*/

    //update the book database
    /*database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });*/
    return res.json({
        books: updatedBookDatabase,
        publications: updatedPublicationDatabase,
        message: "Successfully updated publication", 
    });
});





//API - //To delete a publication
/* 
Route               /publication/delete
Description       to delete a publication
Access              public
Parameter           pubId
Methods             DELETE  
*/

Router.delete("/delete/:pubId", async (req, res) =>{
    
    const updatedPublication = await PublicationModel.findOneAndDelete(
        {
            id: req.params.pubId,
        }
    );
    /*const updatedPublicationDatabase = database.publication.filter(
        (publication) => publication.id !== parseInt(req.params.pubId)
    );

    database.publication = updatedPublicationDatabase;*/
    return res.json({ publication: updatedPublication });
});
//API - //To delete a book from publication
/* 
Route               /publication/delete/book
Description       to delete a book from publication
Access              public
Parameter           isbn, pubId
Methods             DELETE  
*/



Router.delete("/delete/book/:isbn/:pubId", async (req, res) =>{
    
    // update book database
    const updatedBookDatabase = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            publications: 0,
        },
        {
            new: true,
        }
    );

    //update publication database
    const updatedPublicationDatabase = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.pubId),
        },
        {
            $pull:{
                books: req.params.isbn,
            },
        },
        {
            new: true,
        }
    )
    
    // update book database
    /*database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publications = 0;
            return;
        }
    });*/
    //update publication database

    /*database.publication.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)){
            const newBookList = publication.books.filter(
                (book) => book !== req.params.isbn
            );
            publication.books = newBookList;
            return;
        }
    });*/
    return res.json({
        books: updatedBookDatabase,
        publications: updatedPublicationDatabase,
        message: "publication was deleted"});
});

module.exports = Router;