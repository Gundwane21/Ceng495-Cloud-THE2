const APP_ID = 'rhea-goodreads-app-sawog';
const ATLAS_SERVICE = 'mongodb-atlas';
const app = new Realm.App({id: APP_ID});

// Function executed by the LOGIN button.
const login = async () => {
    const credentials = Realm.Credentials.anonymous();
    try {
        const user = await app.logIn(credentials);
        $('#user').empty().append("User ID: " + user.id); // update the user div with the user ID
    } catch (err) {
        console.error("Failed to log in", err);
    }
};

// Function executed by the "FIND 20 MOVIES" button.
const findMovies = async () => {
    let collMovies;
    try {
        // Access the movies collection through MDB Realm & the readonly rule.
        const mongodb = app.currentUser.mongoClient(ATLAS_SERVICE);
        collMovies = mongodb.db("sample_mflix").collection("movies");
    } catch (err) {
        $("#user").append("Need to login first.");
        console.error("Need to log in first", err);
        return;
    }

    // Retrieve 20 movie titles (only the titles thanks to the projection).
    const movies_titles = await collMovies.find({}, {
        "projection": {
            "_id": 0,
            "title": 1
        },
        "limit": 20
    });

    // Access the movies div and clear it.
    let movies_div = $("#movies");
    movies_div.empty();

    // Loop through the 20 movie title and display them in the movies div.
    for (const movie of movies_titles) {
        let p = document.createElement("p");
        p.append(movie.title);
        movies_div.append(p);
    }
};

// USER ADD BOOK ACTION
const addBook = async () => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");

    bookObj = 
        {
            "name": "Sherlock Holmes Red Case1",
            "author": "Arthur Conan Doyle",
            "translator": "Kerem kerem",
            "editor" : "Dummy editor",
            "cover" : "https://www.w3schools.com",
            "isFiction": true,
            "publisher": "dummy publisher",
            "genre" : "Crime",
            "yearPublished": { "$date": "2014-01-22T14:56:59.301Z" },
            "ratingAverage" : 8,
            "allReviews": ["bad!","bad1!","bad2!"]
        }
    collBooks.insertOne(bookObj, function (err,res) {
        if (err) throw err;
        console.log("1 document inserted");
    } );
}

// USER ADD BOOK ACTION
const removeBook = async () => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");
    
    bookObj = 
        {
            "name": "Sherlock Holmes Red Case1",
            "author": "Arthur Conan Doyle",
            "translator": "Kerem kerem",
            "editor" : "Dummy editor",
            "cover" : "https://www.w3schools.com",
            "isFiction": true,
            "publisher": "dummy publisher",
            "genre" : "Crime",
            "yearPublished": { "$date": "2014-01-22T14:56:59.301Z" },
            "ratingAverage" : 8,
            "allReviews": ["bad!","bad1!","bad2!"]
        }
    collBooks.insertOne(bookObj, function (err,res) {
        if (err) throw err;
        console.log("1 document inserted");
    } );
}


// USER ADD BOOK ACTION
const addUser = async () => {
    let collUsers = await getCollectionByLogin("goodreads_db","users");

    userObj = 
        {
            "username": "user1",
            "booksReadCount": 0,
            "favBooks": [],
            "givenRatingsAvrg" : 0,
            "givenReviews" : [],
        }
    collUsers.insertOne(userObj, function (err,res) {
        if (err) throw err;
        console.log("1 user document inserted");
    } );
}

const getCollectionByLogin = async (dbName, collectionName) => {
    try {
        // Access the movies collection through MDB Realm & the readonly rule.
        const mongodb = app.currentUser.mongoClient(ATLAS_SERVICE);
        return mongodb.db(dbName).collection(collectionName);
    } catch (err) {
        $("#user").append("Need to login first.");
        console.error("Need to log in first", err);
        return;
    }
}



// book table entry - document in mongo notation
// {
//     "_id": {
//         "$oid": "628290f314570c239990ca05"
//     },
//     "name": "Sherlock Holmes Red Case",
//     "author": "Arthur Conan Doyle",
//     "translator": "Kerem kerem",
//     "editor" : "Dummy editor",
//     "cover" : "https://www.w3schools.com",
//     "isFiction": true,
//     "publisher": "dummy publisher",
//     "genre" : "Crime",
//     "yearPublished": new ISODate("2021-01-15T06:31:15Z"),
//     "ratingAverage" : 8,
//     "allReviews": ["bad!","bad1!","bad2!"]
// }

// year can not be added in the above form in 
//    "yearPublished": "2021-01-15T06:31:15Z",