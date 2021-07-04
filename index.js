//require("dotenv").config();

const express = require("express");

// Database
const database = require("./database");
//const mongoose = require('mongoose');

//Initialization
const bookAPI = express();

//configurations
bookAPI.use(express.json());

// Establish Database connection

/*await mongoose
    .connect(
        "mongodb+srv://Umesh_01:UmeshDB_01@umeshdb.2rcyj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then (() => console.log("connection established!!!!")); */


/* 
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
bookAPI.get("/", (req, res) => {
    return res.json({ books: database.books });
});

/* 
Route           /is
Description     Get specific book based on ISBN
Access          PUBLIC
Parameter       isbnf
Methods         GET
*/

bookAPI.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => 
        book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0) {
        return res.json({ 
            error: `No book found for the ISBN of ${req.params.isbn}`,
        });
    }

    return res.json({ book: getSpecificBook });
});

/* 
Route           /c
Description     Get specific book based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/

bookAPI.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter((book) => 
        book.category.includes(req.params.category)
    );

    if(getSpecificBook.length === 0) {
        return res.json({ 
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ book: getSpecificBook });
});

/* 
Route           /l
Description     Get specific book based on language
Access          PUBLIC
Parameter       language
Methods         GET
*/

bookAPI.get("/l/:language", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );

    if(getSpecificBook.length === 0) {
        return res.json({ 
            error: `No book found for the language of ${req.params.language}`,
        });
    }

    return res.json({ authors: getSpecificBook });
});

/* 
Route           /au
Description     Get specific book based on author id
Access          PUBLIC
Parameter       authorname
Methods         GET
*/

bookAPI.get("/au/:author", (req, res) => {
    const getSpecificAuthorBooks = database.books.filter(
        (book) => book.author.includes(parseInt(req.params.author))
    );
    console.log(req.params.author)
    if( getSpecificAuthorBooks.length === 0) {
        return res.json({
            error: `No book found with the author id ${req.params.author}`,
        });
    }
    console.log(getSpecificAuthorBooks)
    return res.json({ authors: getSpecificAuthorBooks });
});

/* 
Route           /author
Description     Get all author
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

bookAPI.get("/author", (req, res) => {
    return res.json({ author: database.author});
});

/* 
Route           /author
Description     Get specific author
Access          PUBLIC
Parameter       name
Methods         GET
*/

bookAPI.get("/author/:name", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.name === req.params.name
    );

    if( getSpecificAuthor.length === 0) {
        return res.json({ 
            error: `No author found by the name of ${req.params.name}`,
        });
    }

    return res.json({ author:getSpecificAuthor });
});

/* 
Route           /author/book
Description     Get all author based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/

bookAPI.get("/author/b/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0) {
        return res.json({ 
            error: `No author found for the book of ${req.params.isbn}`,
        });
    }

    return res.json({ book: getSpecificAuthor });
});

/* 
Route           /publication
Description     Get all publication
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

bookAPI.get("/publication", (req, res) => {
    return res.json({ publication: database.publication});
});

/* 
Route           /publication/p
Description     Get specific publication
Access          PUBLIC
Parameter       publication name
Methods         GET
*/

bookAPI.get("/publication/p/:name", (req, res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.name === req.params.name
    );

    if( getSpecificPublication.length === 0)
    {
        return res.json({
            error: `No publication found for the name ${req.params.name}`,
        });
    }

    return res.json({ publication: getSpecificPublication});
});

/* 
Route           /publication/b/
Description     Get list of publication based on book
Access          PUBLIC
Parameter       book name
Methods         GET
*/

bookAPI.get("/publication/pb/:books", (req, res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.books)
    );

    if( getSpecificPublication.length === 0)
    {
        return res.json({
            error: ` No publication found for book ${req.params.books}`,
        });
    }

    return res.json({ publication: getSpecificPublication})
});

/* 
Route           /book/add
Description     add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

bookAPI.post("/book/add", (req, res) => {
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json ({ books: database.books });
});

/* 
Route           /author/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

bookAPI.post("/author/add", (req, res) => {
    const { newAuthor } = req.body;
    database.author.push(newAuthor);
    return res.json ({ author: database.author });
});

/* 
Route           /publication/add
Description     add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

bookAPI.post("/publication/add", (req, res) => {
    const { newPublication } = req.body;
    database.publication.push(newPublication);
    return res.json ({ publication: database.publication });
});

/* 
Route           /book/update/title
Description     update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/

bookAPI.put("/book/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.title = req.body.newBookTitle;
            return;
        }
    });
    return res.json({ books: database.books })
});

/* 
Route           /book/update/title
Description     update/add new author for a book
Access          PUBLIC
Parameter       isbn & authorId
Methods         PUT
*/

bookAPI.put("/book/update/author/:isbn/:authorId", (req, res) => {

    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            console.log(req.params.authorId)
            return book.author.push(parseInt(req.params.authorId));
        }
    });

    // update author database
    database.author.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            return author.books.push(req.params.isbn);
        }
    });
    return res.json({ books: database.books, author: database.author});
});

/* 
Route           /author/update/name
Description     update author name
Access          PUBLIC
Parameter       authorId
Methods         PUT
*/

bookAPI.put("/author/update/name/:authorId", (req, res) => {
    database.author.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)){
            author.name = req.body.newAuthorName;
            return;
        }
    });
    return res.json({ author: database.author });
});

/* 
Route           /publication/update/name
Description     update publication name
Access          PUBLIC
Parameter       publicationId
Methods         PUT
*/

bookAPI.put("/publication/update/name/:pubId", (req, res) => {
    database.publication.forEach((publication) => {
        if(publication.id === parseInt(req.params.pubId)){
            publication.name = req.body.newPublicationName;
            return;
        }
    });
    return res.json({ publication: database.publication });
});

/* 
Route           /publication/update/name
Description     update publication name
Access          PUBLIC
Parameter       publicationId
Methods         PUT
*/

bookAPI.listen(3000, () => console.log("Hey server is running! 😎"))