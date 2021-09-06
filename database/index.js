
//book database
let books = [
    {
        title: "Full Stack web dev",
        ISBN: 12345678,
        author: [1, 2],
        language: "en",
        numberOfPages: 280,
        publication: 1,
        category: ["fiction", "programming", "javascript"],
    },
    {
        title: "programming with python",
        ISBN: 12345987,
        author: [1, 3],
        language: "en",
        numberOfPages: 269,
        publication: 2,
        category: ["fiction", "programming", "python"],
    }

];

//author database
let authors = [
    {
        id: 1,
        name: "dinesh",
        books: [12345678, 12345987]
    },
    {
        id: 2,
        name: "praveen",
        books: [12345678]
    },
    {
        id: 3,
        name: "vedhamuni",
        books: [12345987]
    }

];

//publication database
let publications = [
    {
        id: 1,
        name: "chakra",
        books: [12345678]
    },
    {
        id: 2,
        name: "tutorial",
        books: [12345987]
    }
];

//exporting databases
module.exports = { books, authors, publications };