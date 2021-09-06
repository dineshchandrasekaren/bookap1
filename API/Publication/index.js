
const Router = require('express').Router();

//Import PublicationModel
const PublicationModel = require('../../database/publication');


//! PUBLICATION GET

/*
Route           /publication/
Description     get all publication
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get('/', async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    res.json({ publications: getAllPublications });
});

/*
Route           /publication/
Description     get specificPublication
Access          PUBLIC
Parameters      id
Method          GET
*/
Router.get('/:id', async (req, res) => {
    const specificPublication = await PublicationModel.findOne({ id: parseInt(req.params.id) })
    if (!specificPublication) {
        res.json({ message: `No publication found in [${req.params.id}] this id` })
    } else {
        res.json({ publications: specificPublication });
    }
});
/*
Route           /publication/is/
Description     get specificPublication
Access          PUBLIC
Parameters      isbn
Method          GET
*/
Router.get('/is/:isbn', async (req, res) => {
    const specificPublication = await PublicationModel.findOne({ books: parseInt(req.params.isbn) });
    if (!specificPublication) {
        res.json({ message: `No publication found in [${req.params.isbn}] this isbn` })
    } else {
        res.json({ publications: specificPublication });
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
Router.post('/add/new', async (req, res) => {
    const { newPublication } = req.body;
    PublicationModel.create(newPublication);
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
Router.put('/update/:id', async (req, res) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: parseInt(req.params.id)
    }, {
        name: req.body.name
    });

    return res.json({ publications: updatedPublication, message: "publication was updated" });


});
/*
Route           /publication/update/is/
Description     update publicationName 
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put('/update/is/:isbn', async (req, res) => {
    //update publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: req.body.id
    }, {
        $addToSet: {
            books: parseInt(req.params.isbn)
        }
    }, {
        new: true
    });
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: parseInt(req.params.isbn)
    }, {
        publication: req.body.id
    }, {
        new: true
    });
    return res.json({ publications: updatedPublication, books: updatedBook, message: "publication was updated" });



});
//! PUBLICATION DELETE
/*
Route           /publication/delete/
Description     delete a publication
Access          PUBLIC
Parameters      id
Method          DELETE
*/
Router.delete('/delete/:id', async (req, res) => {
    let updatedPublication = await PublicationModel.findOneAndDelete({ id: parseInt(req.params.id) });
    res.json({ publications: updatedPublication, message: "publication was deleted" });
});

/*
Route           /publication/delete/
Description     delete a book from publication
Access          PUBLIC
Parameters      isbn,pubid
Method          DELETE
*/
Router.delete('/delete/:isbn/:pubid', async (req, res) => {
    //delete a publication from book database
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: parseInt(req.params.isbn)
    }, {
        publication: 0
    }, { new: true });

    //delete a book from publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate({
        id: parseInt(req.params.pubid)
    }, {
        $pull: {

            books: parseInt(req.params.isbn)
        }
    })

    return res.json({ books: books, publications: publications, message: "book was updated" });
});

module.exports = Router;