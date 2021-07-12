require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

//Importing
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications  = require("./API/Publication");


//Initialization
const booky = express();

booky.use(express.json());


//establish database connection
mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log("connection established!!!!!!!"));

    //Initializing microservices
    booky.use("/book", Books);
    booky.use("/author", Authors);
    booky.use("/publication", Publications);

    booky.listen(3000, () => console.log("Hey my server is running"));

//agent should 
//Talk to mongoDB in way mongodb understands &&
//talk to us in a way we understand