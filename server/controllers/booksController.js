const fetch = require('node-fetch');
const db = require('../models/database');
const { googleBooksAPI } = require('../secret');
const booksController = {};


booksController.addBookByAuthor = (req, res, next) => {
    // helper function to split the sting in to first and last name
    console.log('In the beginning of the add books by author middleware')
    function findNames(string) {
        string.toLowerCase();
        const newNames = string.toLowerCase().split(' ');
        return {
            firstName: newNames[0],
            lastName: newNames[1],
        };
    }
    // passing in the string that comes from the front end
    // const names = findNames(req.body.author);
    //const firstName = names.firstName;
    // const lastName = names.lastName;
    const firstName = 'Stephen';
    const lastName = 'King';
    console.log(`About to make a fetch request with th the last name ${lastName}`)
    console.log(googleBooksAPI.key);
    // API call to retrieve the books by the author
    fetch(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${lastName}${firstName}&key=${googleBooksAPI.key}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        for(let i = 0; i < data.length; i++){
            res.locals.isbn = data[i].industryIdentifiers[1].identifier;
            res.locals.title = data[i].title;
            res.locals.author = data[i].author;
            res.local.genre = data[i].categories;
            res.locals.published = data[i].publishedDate;
            res.locals.language = data[i].language;
            res.locals.medium = data[i].printType;
            res.locals.publisher = data[i].publisher;
        }
    });
    console.log('made it through the middleware')
};

booksController.addBookByTitle = (req, res, next) => {
    // const title = req.body.title;
    const title = 'harry potter and the chamber of secrets';
    // API call to retrieve the books by the title
    fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle${title}&key=${googleBooksAPI.key}`)
    .then(response => response.json())
    .then((data) => {
        // console.log(data.items)
        res.locals.allTheData = data.items;
        console.log(res.locals.allTheData)
    })
    .catch (e => next({
        log: `There was an issue in the booksContoller.addBookByAuthor: ERROR: ${typeof e === 'object' ? JSON.stringify(e) : e}`,
        message: {err: 'That bookController is causing me problems AGAIN'}
    }));

    // console.log(res.locals.allTheData)

    // function createBooks (booksData) {
    //     let bookResults = [];
    //     for(let i = 0; i < booksData.items.length - 1; i++){
    //         let tempBooks ={};
    //         if(booksData.items[i] !== undefined){
    //             tempBooks = {
    //                 title: booksData.items[i].volumeInfo.title || undefined, 
    //                 author: booksData.items[i].volumeInfo.authors || undefined,
    //                 publisher: booksData.items[i].volumeInfo.publisher || undefined,
    //                 published: booksData.items[i].volumeInfo.publishedDate || undefined,
    //                 isbn: booksData.items[i].volumeInfo.industryIdentifiers[1].identifier || undefined,
    //                 genre: booksData.items[i].volumeInfo.categories || undefined,
    //                 medium: booksData.items[i].volumeInfo.printType || undefined,
    //                 language: booksData.items[i].volumeInfo.language || undefined, 
    //              };
    //              console.log(i)
    //              console.log(tempBooks) 
    //              bookResults.push(tempBooks) 
    //         } else if (booksData.items[i] === undefined){
    //             tempBooks = {}
    //         }
    //     }
    //     res.locals.bookResults = bookResults;
    //     console.log(res.locals.bookResults)

    // }
    
};

module.exports = booksController;