require("dotenv").config();

//frameworks
const express = require('express');
const mongoose = require('mongoose');

//database
let { books, authors, publications } = require('./database/database');

//Initialization
const app = express();
app.use(express.json())

//Models
const BookModel = require('./database/book');
const AuthorModel = require('./database/author');
const PublicationModel = require('./database/publication');

//?---------------------------------------------------------------------------------------

//database connection establish
mongoose.connect(process.env.MONGO_URL).then(() => console.log("connection established"));


//!BOOK GET

/* 
Route           /book/
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

app.get('/book/', (req, res) => {
    res.send(books);
});

/*
Route           /book/
Description     get specificBooks
Access          PUBLIC
Parameters      isbn
Method          GET
*/
app.get('/book/:isbn', (req, res) => {
    const specificBook = books.filter(book => parseInt(req.params.isbn) === book.ISBN);
    if (specificBook.length === 0) {
        res.send(`No book found in [${req.params.isbn}] this isbn`)
    } else {
        res.send(specificBook);
    }
});

/*
Route           /book/c/
Description     get a list of books based on category
Access          PUBLIC
Parameters      category
Method          GET
*/
app.get('/book/c/:category', (req, res) => {
    const specificBook = books.filter(book =>
        book.category.includes(req.params.category));
    if (specificBook.length === 0) {
        res.send(`No book found in [${req.params.category}] this category`)
    } else {
        res.send(specificBook);
    }
});

/*
Route           /book/a/
Description     get a list of books based on author
Access          PUBLIC
Parameters      id
Method          GET
*/
app.get('/book/a/:id', (req, res) => {
    const specificBook = books.filter(book =>
        book.author.includes(parseInt(req.params.id)));
    if (specificBook.length === 0) {
        res.send(`No book found in [${req.params.category}] this category`)
    } else {
        res.send(specificBook);
    }
});

//! BOOK POST

/*
Route           /book/add/new
Description     add new book
Access          PUBLIC
Parameters      NONE
Method          POST
*/
app.post('/book/add/new', (req, res) => {
    const { newBook } = req.body;
    books.push(newBook);
    return res.json({ book: newBook, message: "book was added" });
});

//! BOOK PUT

/*
Route           /book/update/
Description     add book details
Access          PUBLIC
Parameters      ISBN
Method          PUT
*/
app.put('/book/update/:isbn', (req, res) => {
    books.forEach((book) => {
        if (parseInt(req.params.isbn) === book.ISBN) {
            book.title = req.body.title;
            return;
        }
    })
    return res.json({ book: books, message: "book was updated" });
});
/*
Route           /book/update/is/
Description     add update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
app.put('/book/update/is/:isbn', (req, res) => {

    //add new author
    authors.forEach(author => {
        if (req.body.newAuthor.id == author.id) {

            author.books.push(parseInt(req.params.isbn));
        }
    })

    //updating newauthor to book
    books.forEach((book) => {
        if (parseInt(req.params.isbn) === book.ISBN) {
            book.author.push(req.body.newAuthor.id);
            return res.json({ book: books, author: authors, message: "book was updated" });;
        } else {
            return res.json({ message: `No book found in [${req.params.isbn}] this isbn` });
        }
    });
});
//! BOOK DELETE
/*
Route           /book/delete/
Description     delete a book
Access          PUBLIC
Parameters      ISBN
Method          DELETE
*/
app.delete('/book/delete/:isbn', (req, res) => {
    let updatedBooks = books.filter(book => book.ISBN !== parseInt(req.params.isbn));
    books = updatedBooks;
    return res.json({ books: books, message: "book was updated" });
});
/*
Route           /book/delete/
Description     delete a author from book
Access          PUBLIC
Parameters      isbn,authorid
Method          DELETE
*/
app.delete('/book/delete/:isbn/:authorid', (req, res) => {
    //delete a author from book database
    books.forEach(book => {
        if (book.ISBN == req.params.isbn) {
            const updatedAuthor = book.author.filter(id => id !== parseInt(req.params.authorid));
            book.author = updatedAuthor;
        }
    });
    //delete a book from author database
    authors.forEach(author => {
        if (author.id == req.params.authorid) {
            const updatedBook = author.books.filter(isbn => isbn !== parseInt(req.params.isbn));
            author.books = updatedBook;
        }
    });
    return res.json({ books: books, message: "book was updated" });
});
//?---------------------------------------------------------------------------------------

//! AUTHOR GET

/*
Route           /author/
Description     get all author
Access          PUBLIC
Parameters      NONE
Method          GET
*/
app.get('/author/', (req, res) => {
    res.send(authors);
});

/*
Route           /author/
Description     get specificAuthor
Access          PUBLIC
Parameters      id
Method          GET
*/
app.get('/author/:id', (req, res) => {
    const specificAuthor = authors.filter(author => parseInt(req.params.id) === author.id);
    if (specificAuthor.length === 0) {
        res.send(`No author found in [${req.params.id}] this id`)
    } else {
        res.send(specificAuthor);
    }
});
/*
Route           /author/is/
Description     get  a list of authors based on a book.
Access          PUBLIC
Parameters      id
Method          GET
*/
app.get('/author/is/:isbn', (req, res) => {
    const specificAuthor = authors.filter(author => author.books.includes(parseInt(req.params.isbn)));
    if (specificAuthor.length === 0) {
        res.send(`No author found in [${req.params.id}] this isbn`)
    } else {
        res.send(specificAuthor);
    }
});

//! AUTHOR POST

/*
Route           /author/add/new
Description     add newAuthor
Access          PUBLIC
Parameters      NONE
Method          POST
*/
app.post('/author/add/new', (req, res) => {
    const { newAuthor } = req.body;
    authors.push(newAuthor);
    return res.json({ authors: newAuthor, message: "author was added" });
});
//! AUTHOR PUT
/*
Route           /author/update/
Description     update authorName 
Access          PUBLIC
Parameters      ID
Method          PUT
*/
app.put('/author/update/:id', (req, res) => {
    authors.forEach(author => {
        if (req.params.id == author.id) {
            author.name = req.body.name;
            return res.json({ authors: authors, message: "author was updated" });
        } else {
            return res.json({ message: `No author found in [${req.params.id}] this id` });
        }

    })

});

//! AUTHOR DELETE 
/*
Route           /author/delete/
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
app.delete('/author/delete/:id', (req, res) => {
    let updatedAuthor = authors.filter(author => author.id !== parseInt(req.params.id));
    authors = updatedAuthor;
    return res.json({ authors: authors, message: "author was deleted" });
});

//?---------------------------------------------------------------------------------------

//! PUBLICATION GET

/*
Route           /publication/
Description     get all publication
Access          PUBLIC
Parameters      NONE
Method          GET
*/

app.get('/publication/', (req, res) => {
    res.send(publications);
});

/*
Route           /publication/
Description     get specificPublication
Access          PUBLIC
Parameters      id
Method          GET
*/
app.get('/publication/:id', (req, res) => {
    const specificPublication = publications.filter(publication => parseInt(req.params.id) === publication.id);
    if (specificPublication.length === 0) {
        res.send(`No publication found in [${req.params.id}] this id`)
    } else {
        res.send(specificPublication);
    }
});
/*
Route           /publication/is/
Description     get specificPublication
Access          PUBLIC
Parameters      isbn
Method          GET
*/
app.get('/publication/is/:isbn', (req, res) => {
    const specificPublication = publications.filter(publication => publication.books.includes(parseInt(req.params.isbn)));
    if (specificPublication.length === 0) {
        res.send(`No publication found in [${req.params.id}] this id`)
    } else {
        res.send(specificPublication);
    }
});

//! PUBLICATION POST

/*
Route           /publication/add/new
Description     add newPublication
Access          PUBLIC
Parameters      NONE
Method          POST
*/
app.post('/publication/add/new', (req, res) => {
    const { newPublication } = req.body;
    authors.push(newPublication);
    return res.json({ publications: newPublication, message: "book was added" });
});

//! PUBLICATION PUT
/*
Route           /publication/update/
Description     update publicationName 
Access          PUBLIC
Parameters      ID
Method          PUT
*/
app.put('/publication/update/:id', (req, res) => {
    authors.forEach(publication => {
        if (req.params.id == publication.id) {
            publication.name = req.body.name;
            return res.json({ publications: publications, message: "publication was updated" });
        } else {
            return res.json({ message: `No publication found in [${req.params.id}] this id` });
        }

    })

});
/*
Route           /publication/update/is/
Description     update publicationName 
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
app.put('/publication/update/is/:isbn', (req, res) => {
    //update publication database
    publications.forEach(publication => {
        if (req.body.id == publication.id) {
            publication.books.push(parseInt(req.params.isbn));

        }
        //update book database
        books.forEach(book => {
            if (req.params.isbn == book.ISBN) {
                book.publication = parseInt(req.body.id);
            }
        });

    });
    return res.json({ publications: publications, books: books, message: "publication was updated" });



});
//! PUBLICATION DELETE
/*
Route           /publication/delete/
Description     delete a publication
Access          PUBLIC
Parameters      id
Method          DELETE
*/
app.delete('/publication/delete/:id', (req, res) => {
    let updatedPublication = publications.filter(publication => publication.id !== parseInt(req.params.id));
    publications = updatedPublication;
    return res.json({ publications: publications, message: "publication was deleted" });
});

/*
Route           /publication/delete/
Description     delete a author from publication
Access          PUBLIC
Parameters      isbn,pubid
Method          DELETE
*/
app.delete('/publication/delete/:isbn/:pubid', (req, res) => {
    //delete a publication from book database
    books.forEach(book => {
        if (book.ISBN == req.params.isbn) {
            book.publication = 0;
        }
    });
    //delete a book from author database
    publications.forEach(publication => {
        if (publication.id == req.params.pubid) {
            const updatedBook = publication.books.filter(isbn => isbn !== parseInt(req.params.isbn));
            publication.books = updatedBook;
        }
    });
    return res.json({ books: books,publications:publications, message: "book was updated" });
});

//?---------------------------------------------------------------------------------------

//! listening port
app.listen('4000', () => console.log("server is running"));