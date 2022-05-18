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

// GOTO PROFILE PAGE
const gotoProfilePage = () => {
    window.location.href = "./profile.html"
}

// RATE BOOK
const rateBook = async () => {
    
}


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
            "ratingAverage" : 0,
            //add  numOfUsers to keep track of rating average
            "allReviews": []
        }
    collBooks.insertOne(bookObj, function (err,res) {
        if (err) throw err;
        console.log("1 document inserted");
    } );
}

// get selected addBook JQUERY
$('#addBookForm').submit(function(event) {
    // get all the inputs into an array.
    var $inputs = new FormData($('#addBookForm'));
    console.log($inputs)
    // addUser($inputs.val())
    event.preventDefault();
});

// USER REMOVE BOOK ACTION
const removeBook = async () => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");
    var bookName = "Sherlock Holmes Red Case1";
    var author = "Arthur Conan Doyle";

    const books = await collBooks.find({$or: [{"name":bookName} , {"author":author}] });
    console.log(books);
    
    // Ask the user which one to delete
    if ( books.length > 0 ){
        //hardcode now, TODO: Make user select later
        chosenBook = books[0]
        _id = chosenBook._id
        console.log("chosen book id"+ _id)
        collBooks.deleteOne({"_id" : _id}) 

    }
    else{
        console.log("Choose a book to delete")
    }
}


// USER ADD BOOK ACTION
const addUser = async (username) => {
    let collUsers = await getCollectionByLogin("goodreads_db","users");

    userObj = 
        {
            "username": username,
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

// get selected addUser JQUERY
$('#addUserForm').submit(function(event) {
    // get all the inputs into an array.
    var $inputs = $('#addUserForm :input');
    console.log($inputs.val())
    addUser($inputs.val())
    event.preventDefault();
});


// USER REMOVE BOOK ACTION
const removeUser = async (username) => {
    let collUsers = await getCollectionByLogin("goodreads_db","users");

    const user = await collUsers.findOne({ "username" : username  });
    console.log(user);
    
    // Ask the user which one to delete
    if ( user ){
        _id = user._id
        console.log("chosen user id "+ _id)
        collUsers.deleteOne({"_id" : _id}) 

    }
    else{
        console.log("Choose a valid user to delete")
    }
}

// get selected addUser JQUERY
$('#removeUserForm').submit(function(event) {
    // get all the inputs into an array.
    var $inputs = $('#removeUserForm :input');
    console.log($inputs.val())
    removeUser($inputs.val())
    event.preventDefault();
});


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


































// year can not be added in the above form in 
//    "yearPublished": "2021-01-15T06:31:15Z",

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


