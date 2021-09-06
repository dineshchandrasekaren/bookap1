const Router = require('express').Router();

//Import AuthorModel
const AuthorModel = require('../../database/author');

//! AUTHOR GET

/*
Route           /author/
Description     get all author
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get('/', async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    res.json({ authors: getAllAuthors });
});

/*
Route           /author/
Description     get specificAuthor
Access          PUBLIC
Parameters      id
Method          GET
*/
Router.get('/:id', async (req, res) => {
    const specificAuthor = await AuthorModel.findOne({ id: parseInt(req.params.id) });
    if (!specificAuthor) {
        res.json({ message: `No author found in [${req.params.id}] this id` })
    } else {
        res.json({ authors: specificAuthor });
    }
});
/*
Route           /author/is/
Description     get  a list of authors based on a book.
Access          PUBLIC
Parameters      id
Method          GET
*/
Router.get('/is/:isbn', async (req, res) => {
    const specificAuthor = await AuthorModel.findOne({ books: parseInt(req.params.isbn) });
    if (!specificAuthor) {
        res.json({ message: `No author found in [${req.params.isbn}] this isbn` })
    } else {
        res.json({ authors: specificAuthor });
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
Router.post('/add/new', async (req, res) => {
    const { newAuthor } = req.body;
    AuthorModel.create(newAuthor);
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
Router.put('/update/:id', async (req, res) => {
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: parseInt(req.params.id)
    }, {
        name: req.body.name
    }, {
        new: true
    })
    return res.json({ authors: authors, message: "author was updated" });
});

//! AUTHOR DELETE 
/*
Route           /author/delete/
Description     delete a author
Access          PUBLIC
Parameters      id
Method          DELETE
*/
Router.delete('/delete/:id', async (req, res) => {
    const updatedAuthor = await AuthorModel.findOneAndDelete({
        id: parseInt(req.params.id)
    });
    return res.json({ authors: updatedAuthor, message: "author was deleted" });
});

module.exports = Router;