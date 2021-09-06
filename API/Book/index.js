const Router = require('express').Router();

//Import BookModel
const BookModel = require('../../database/book');

//!BOOK GET

/* 
Route           /book/
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get('/', async (req, res) => {
    const getAllBook = await BookModel.find();
    res.json({ books: getAllBook });
});

/*
Route           /book/
Description     get specificBooks
Access          PUBLIC
Parameters      isbn
Method          GET
*/
Router.get('/:isbn', async (req, res) => {
    const specificBook = await BookModel.findOne({ ISBN: parseInt(req.params.isbn) });
    if (!specificBook) {
        res.json({ message: `No book found in [${req.params.isbn}] this isbn` })
    } else {
        res.json({ books: specificBook });
    }
});

/*
Route           /book/c/
Description     get a list of books based on category
Access          PUBLIC
Parameters      category
Method          GET
*/
Router.get('/c/:category', async (req, res) => {
    const specificBook = await BookModel.findOne({ category: req.params.category });
    if (!specificBook) {
        res.json({ message: `No book found in [${req.params.category}] this category` })
    } else {
        res.json({ books: specificBook });
    }
});

/*
Route           /book/a/
Description     get a list of books based on author
Access          PUBLIC
Parameters      id
Method          GET
*/
Router.get('/a/:id', async (req, res) => {
    const specificBook = await BookModel.findOne({ author: parseInt(req.params.id) });
    if (!specificBook) {
        res.json({ message: `No book found in [${req.params.id}] this author` })
    } else {
        res.json({ books: specificBook });
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
Router.post('/add/new', async (req, res) => {
    const { newBook } = req.body;
    BookModel.create(newBook);
    return res.json({ books: newBook, message: "book was added" });
});

//! BOOK PUT

/*
Route           /book/update/
Description     add book details
Access          PUBLIC
Parameters      ISBN
Method          PUT
*/
Router.put('/update/:isbn', async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: parseInt(req.params.isbn)
        }, {
        title: req.body.title
    }, {
        new: true
    });

    return res.json({ book: updatedBook, message: "book was updated" });
});
/*
Route           /book/update/is/
Description     add update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put('/update/is/:isbn', async (req, res) => {

    //add new author
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: req.body.id
    }, {
        $addToSet: {
            books: parseInt(req.params.isbn)
        }
    }, { new: true });


    //updating newauthor to book
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: parseInt(req.params.isbn)
    }, {
        $addToSet: {
            author: req.body.id
        }
    }, { new: true });
    return res.json({ book: books, author: updatedAuthor, message: "book was updated" });
});
//! BOOK DELETE
/*
Route           /book/delete/
Description     delete a book
Access          PUBLIC
Parameters      ISBN
Method          DELETE
*/
Router.delete('/delete/:isbn', async (req, res) => {
    const updatedBook = await BookModel.findOneAndDelete({
        ISBN: parseInt(req.params.isbn)
    })
    return res.json({ books: updatedBook, message: "book was updated" });
});
/*
Route           /book/delete/
Description     delete a author from book
Access          PUBLIC
Parameters      isbn,authorid
Method          DELETE
*/
Router.delete('/delete/:isbn/:authorid', async (req, res) => {
    //delete a author from book database
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: parseInt(req.params.isbn)
    }, {
        $pull: {
            author: parseInt(req.params.authorid)
        }
    });
    //delete a book from author database
    const updateAuthor = await AuthorModel.findOneAndUpdate({
        id: parseInt(req.params.authorid)
    }, {
        $pull: {
            books: parseInt(req.params.isbn)
        }
    });

    return res.json({ books: updatedBook, authors: updateAuthor, message: "book was updated" });
});

module.exports = Router;