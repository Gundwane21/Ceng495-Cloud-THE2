const APP_ID = 'rhea-goodreads-app-sawog';
const ATLAS_SERVICE = 'mongodb-atlas';
const app = new Realm.App({id: APP_ID});

var currentProfileUser = "";

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

// get selected addUser JQUERY
$('#loginButton1').submit(function(event) {
    event.preventDefault();
    login();    
});


// GOTO PROFILE PAGE
const buildProfilePage = async () => {

    let collUsers = await getCollectionByLogin("goodreads_db","users");

    currentProfileUser = localStorage.getItem("currentUser");
    console.log(localStorage.getItem("currentUser"))
    const user = await collUsers.findOne({ "username" : currentProfileUser  });
    console.log("buildProfileCalled")
    console.log(user);

    if (user){
        const header = ["User Attribute Names","User Attribute Values" ];
        delete user["_id"];

        //sort the reviews on fav books and ratings
        var sortedReviewList = await sortUsersReviews(user);
        // console.log(sortedReviewList);
        console.log(sortUsersReviews);

        const userAtrs = Object.keys(user);
        const userAtrVals = Object.values(user);

        tableCreate(header,userAtrs,userAtrVals);
        console.log(user)
    }

    else{
        const msg = "username "+ currentProfileUser + " does not exists!";
        // alert(msg);
    }
}
// return sorted [ [bookId,review] ]
const sortUsersReviews = async (user) => {

    let collBooks = await getCollectionByLogin("goodreads_db","books");

    var userReviewList = user["givenReviews"];
    var favBooks = user["favBooks"];
    var sortedReviews = [];
    
    if (favBooks.length > 0){
        for(let i = 0 ; i <userReviewList.length ; i++){
            var entry = userReviewList[i];
            if(entry[0]== favBooks[0]){
                sortedReviews.push(entry);
                userReviewList.splice(i,1);
                break;
            }
        }            
    }

    var rateArrayByBookIndices = []
    // [ [rateValue, index in reviewArray ] , [] .. ]
    for(let i = 0 ; i <userReviewList.length ; i++){
        var entry = userReviewList[i];
        const bookId = entry[0];
        const bookDoc = await collBooks.findOne({"_id":bookId});
        console.log("sortUsers method");
        const ratersJSON = bookDoc["ratersJSON"];
        const rateVal = ratersJSON[user["username"]];
        rateArrayByBookIndices.push([rateVal,i]);
    }            

    rateArrayByBookIndices.sort((a,b) => b[0] - a[0] );
    for(let i =  0 ; i < rateArrayByBookIndices.length; i++){
        const maxRateIndex = rateArrayByBookIndices[i][1];
        sortedReviews.push(userReviewList[maxRateIndex]);
    }
    console.log("WHILE RETURNING SORTED LIST");
    console.log(userReviewList);
    console.log(sortedReviews);
    return sortedReviews;
} 

const mapBookIdToName = async (bookId) =>{
    let collBooks = await getCollectionByLogin("goodreads_db","books");
    const bookDoc = collBooks.findOne({"_id":bookId});
    return bookDoc["name"];
}

// get selected addUser JQUERY
$('#gotoProfileForm').submit(function(event) {
    event.preventDefault();
    var name = $('#profileUsername').val();
    console.log(typeof(name))
    currentProfileUser = name;
    localStorage.setItem("currentUser",name)
    return false;
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// USER ADD BOOK ACTION

const addBook = async (bookObj) => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");
    console.log(bookObj)

    collBooks.insertOne(bookObj, function (err,res) {
        if (err) throw err;
        console.log("1 document inserted");
    } );
}

// get selected addBook JQUERY
$('#addBookForm button').click(function(event) {
    // get all the inputs into an array.
    event.preventDefault();

    $_name= $('#addBookName').val();
    $_author= $('#addAuthorName').val();
    $_publisher= $('#addPublisherName').val();
    $_translator= $('#addTranslatorName').val();
    $_editor= $('#addEditorName').val();

    console.log("addBook Form clicked");
    console.log($(this).attr("value"));
    if( $(this).attr("value") == "button-add-book"){

        $_coverLink= $('#addCoverLink').val();
        $_isFiction = $("input[name='flexRadioDefault']:checked").val();
        $_genre= $('#AddGenre option:selected').text();
        $_datePub= $('#addBookDate').val();

        console.log($_genre)
        console.log(typeof($_datePub))

        obj = {
            "name": $_name,
            "author": $_author,
            "translator": $_translator,
            "editor" : $_editor,
            "cover" : $_coverLink,
            "isFiction": false,
            "publisher": $_publisher,
            "yearPublished": { "$date":(new Date($_datePub)).toISOString() },
            "ratingAverage" : 0,
            "numOfUsers" : 0,
            "allReviews": [],
            "ratersJSON": {}
        }

        // User selected fiction
        if ($_isFiction){
            obj["isFiction"] = true;
            obj["genre"] = $_genre
        }

        addBook(obj)
    }
    else if ( $(this).attr("value") == "button-remove-book"){
        obj = {
            "name": $_name,
            "author": $_author,
            "translator": $_translator,
            "editor" : $_editor,
            "publisher": $_publisher,
        }
        removeBook(obj);
    }
});

// USER REMOVE BOOK ACTION
const removeBook = async (bookObj) => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");

    console.log("sent obj  parameters");
    console.log(bookObj);

    const book = await collBooks.findOne({$and: [{"name":bookObj["name"]} , {"author":bookObj["author"]} ,{"publisher": bookObj["publisher"] }] });
    console.log(book);
    
    // Ask the user which one to delete
    if ( book ){
        //hardcode now, TODO: Make user select later
        chosenBook = book
        _id = chosenBook._id
        console.log("chosen book id"+ _id)
        collBooks.deleteOne({"_id" : _id}) 

    }
    else{
        const msg = "Selected book to remove is not correct, Make sure about parameters. Check Books tab of website to learn exact author name etc."
        alert(msg);
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// USER ADD BOOK ACTION
const addUser = async (username) => {
    let collUsers = await getCollectionByLogin("goodreads_db","users");
    currentProfileUser =username;
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
$('#addUserForm button').click(function(event) {
    event.preventDefault();
    console.log($(this).attr("value"))
    var $inputs = $('#addUserForm :input');
    console.log($inputs.val())
    if ($(this).attr("value") == "button-add-user"){
        
        addUser($inputs.val());        
    }
    else if($(this).attr("value") == "button-remove-user" ){
        removeUser($inputs.val());
    }
});


// USER REMOVE BOOK ACTION
const removeUser = async (username) => {
    let collUsers = await getCollectionByLogin("goodreads_db","users");
    let collBooks = await getCollectionByLogin("goodreads_db","books");

    const user = await collUsers.findOne({ "username" : username  });
    console.log(user);
    
    // Ask the user which one to delete
    if ( user ){
        _id = user._id
        console.log("chosen user id "+ _id)
        collUsers.deleteOne({"_id" : _id}) 

        //delete reviews
        const givenReviews = user["givenReviews"];
        for (let i= 0; i < givenReviews.length ; i++){
            const bookId = givenReviews[i][0];
            var bookObj = await collBooks.findOne({"_id":bookId});
            var allReviews = bookObj["allReviews"];
            for(let j=0; j < allReviews.length ;j++){
                if(user["username"] == allReviews[j][0] ){
                    allReviews.splice(j,1);
                    break;    
                }
            }
            // remove the selected review of user from books all reviews list and rewrite
            await collBooks.updateOne({"_id":bookObj["_id"]} ,{$set : {"allReviews":allReviews}} )
        }

        // get users rated books
        const username = user["username"]
        const query = { [`ratersJSON.${username}`]: { $exists : true } };
        var ratedBookObjs = await collBooks.find(query);

        for(let i=0 ; i< ratedBookObjs.length ; i++){
            const ratedBookObj = ratedBookObjs[i];
            var ratersJSON = ratedBookObj["ratersJSON"];
            const rateOfUser = ratersJSON[username];
            console.log("rremovebook rate");
            console.log(typeof(rateOfUser
                ));
            delete ratersJSON[username];
            var numOfUsers = ratedBookObj["numOfUsers"];
            var ratingAverage = ratedBookObj["ratingAverage"];
            var totalRate = ratingAverage * numOfUsers; 
            numOfUsers--;
            totalRate -= rateOfUser;
            if(numOfUsers !=0){
                ratingAverage = totalRate / numOfUsers;
            }
            else{
                ratingAverage = 0;
            }
            
            await collBooks.updateOne({"_id":ratedBookObj["_id"]} , { $set : {"numOfUsers":numOfUsers} } );
            await collBooks.updateOne({"_id":ratedBookObj["_id"]} , { $set : {"ratingAverage":ratingAverage} } );
            await collBooks.updateOne({"_id":ratedBookObj["_id"]} , { $set : {"ratersJSON":ratersJSON} } );
        }


        const msg = "User succesfully removed";
        alert(msg);

    }
    else{
        const msg = "username: " + username + " does not exist";
        alert(msg);    
    }
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const getAllBooks2 = async (formIDString) => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");

    const books = await collBooks.find({});
    renderBooksDropDown(books,formIDString);
}

const renderBooksDropDown = (books,formIDString) => {
    var form = document.getElementById(formIDString);
    console.log("renderBooksDropdown");
    console.log(form);
    var selectList = document.createElement("select");
    selectList.text = "Select Book";
    const num = books.length;
    console.log(books);
    for (let i = 0 ; i < num ; i++){
        var newbook = books[i]["name"] + "," + books[i]["author"] + ","+ books[i]["publisher"] ;        
        var optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = newbook;
        optionElement.selected = false;
        selectList.appendChild(optionElement);
    }
    console.log(form);
    form.insertBefore(selectList,form.firstChild);
}


const rateBook = async (bookObj,givenRating) => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");
    let collUsers = await getCollectionByLogin("goodreads_db","users");

    currentProfileUser = localStorage.getItem("currentUser");
    
    const bookDoc = await collBooks.findOne({$and: [{"name":bookObj["name"]} , {"author":bookObj["author"]}, {"publisher":bookObj["publisher"]}]});
    const ratersJSON = bookDoc["ratersJSON"];
    console.log("rateBook method");
    console.log(bookDoc);
   
    //get book average and readerCount 
    var readerCount = bookDoc["numOfUsers"];
    var ratingAverage = bookDoc["ratingAverage"];
    var total = ratingAverage * readerCount;

    // get  user readCount and ratingAverage
    const userDoc = await collUsers.findOne({"username": currentProfileUser});
    var booksReadCount = userDoc["booksReadCount"];
    var givenRatingsAvrg = userDoc["givenRatingsAvrg"];
    var totalGivenRatings = booksReadCount * givenRatingsAvrg ;

    // query string for updating raters in books.ratersJSON json
    const queryString = "ratersJSON."+currentProfileUser;

    // user is NOT rated this book before do stuuf
    if( !(currentProfileUser in ratersJSON)){
        
        total += givenRating;
        readerCount +=1;
        ratingAverage = total / readerCount;
        console.log()
        //update specific book properties
        const updateDoc2 = await collBooks.updateOne({ "_id": bookDoc["_id"]} ,{$set : {"numOfUsers": readerCount }} , function (err,res) {
            if (err) throw err;
            console.log("update numOfUserBook");
        } );

        totalGivenRatings += givenRating;
        booksReadCount +=1
        givenRatingsAvrg = totalGivenRatings / booksReadCount;

        //update specific user properties
        const updateDoc5 = await collUsers.updateOne({ "_id": userDoc["_id"]} ,{$set : {"booksReadCount": booksReadCount }}  );
    }
    // user is previously rated this book
    else{
        // calculate book ratingAverage
        const previousRating = ratersJSON[currentProfileUser];
        total -= previousRating;
        total += givenRating;
        ratingAverage = total / readerCount;

        //calculate user ratingAverage
        totalGivenRatings -= previousRating;
        totalGivenRatings += givenRating;
        givenRatingsAvrg = totalGivenRatings / booksReadCount;

    }
    ratersJSON[currentProfileUser] = givenRating;
    // update book common 
    const updateDoc = await collBooks.updateOne({ "_id": bookDoc["_id"]} ,{$set : {"ratersJSON": ratersJSON }}  );
    const updateDoc3 = await collBooks.updateOne({ "_id": bookDoc["_id"]} ,{$set : {"ratingAverage": ratingAverage }}  );

    //update user properties
    const updateDoc4 = await collUsers.updateOne({ "_id": userDoc["_id"]} ,{$set : {"givenRatingsAvrg": givenRatingsAvrg }}  );

}

// get selected addUser JQUERY
$('#selectBookForm').submit(function(event) {
    // get all the inputs into an array.
    event.preventDefault();
    const text = $('#selectBookForm').find(":selected").text();
    const rating = $('#rateBookValue').val();
    const strings = text.split(",");
    
    bookObj = {
        "name":strings[0],"author":strings[1],"publisher":strings[2]
    };

    rateBook(bookObj,parseInt(rating))
});


const makeFavBook = async (bookObj) => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");
    let collUsers = await getCollectionByLogin("goodreads_db","users");

    currentProfileUser = localStorage.getItem("currentUser");
    
    const bookDoc = await collBooks.findOne({$and: [{"name":bookObj["name"]} , {"author":bookObj["author"]}, {"publisher":bookObj["publisher"]}]});
    const favBookIds = [bookDoc["_id"],bookDoc["name"]];

    // update users favorite book as 1 element queue 
    const userDoc = await collUsers.updateOne({"username":currentProfileUser} , {$set : {"favBooks":favBookIds}});
    
}


// get selected addUser JQUERY
$('#selectFavForm').submit(function(event) {
    // get all the inputs into an array.
    event.preventDefault();
    const text = $('#selectFavForm').find(":selected").text();
    const strings = text.split(",");
    
    bookObj = {
        "name":strings[0],"author":strings[1],"publisher":strings[2]
    };

    makeFavBook(bookObj)
});

// Document types
// userR [  ["book_id" , "review"] , , , ]
// bookReviewList [[  "username": "review"] , , , ]

const makeReview = async (bookObj,review) =>{
    let collBooks = await getCollectionByLogin("goodreads_db","books");
    let collUsers = await getCollectionByLogin("goodreads_db","users");

    currentProfileUser = localStorage.getItem("currentUser");

    var bookDoc = await collBooks.findOne({$and: [{"name":bookObj["name"]} , {"author":bookObj["author"]}, {"publisher":bookObj["publisher"]}]});
    var userDoc = await collUsers.findOne({"username": currentProfileUser});

    // Check if user is rated this book before! 
    // If not rated can not do review
    const ratersJSON = bookDoc["ratersJSON"];

    console.log("makeReview method");
    console.log(ratersJSON);
    if ( currentProfileUser in ratersJSON) {
        reviewListUserDoc = userDoc["givenReviews"];
        var foundFlag = false;
        for(let i = 0 ; i < reviewListUserDoc.length ;i++){
            var listElem = reviewListUserDoc[i];
            //book _id is in users review list 
            if (   listElem[0] == bookDoc["_id"]  ){
                foundFlag = true;
                reviewListUserDoc[i][1] = review;
                break;
            }
        }
    
        // book is NOT is users review list
        if(!foundFlag){
            reviewListUserDoc.push([bookDoc["_id"],review,bookDoc["name"]]);
        }
        // update reviews in users doc
        collUsers.updateOne({"_id": userDoc["_id"]} , { $set: {"givenReviews":reviewListUserDoc} })
    
        reviewListBookDoc = bookDoc["allReviews"];
        var bookFoundFlag = false;
        for(let i = 0 ; i < reviewListBookDoc.length ;i++){
            var listElem = reviewListBookDoc[i];
            // user username is in books review list
            if( listElem[0] == userDoc["username"]){
                bookFoundFlag = true;
                reviewListBookDoc[i][1] = review;
                break;
            }
        }
        // user is NOT is books review list
        if (!bookFoundFlag){
            reviewListBookDoc.push([userDoc["username"],review]);
        }
        //update reviews in book doc
        collBooks.updateOne({"_id": bookDoc["_id"]} , {$set : {"allReviews":reviewListBookDoc}});
    
    }
}


// get selected addUser JQUERY
$('#selectReviewForm').submit(function(event) {
    // get all the inputs into an array.
    event.preventDefault();
    var bookObj = getBookDropDown("selectReviewForm");
    var review = $('#reviewBookValue').val();
    console.log("selectReviewForm button submit");
    console.log(review);
    console.log(bookObj);

    makeReview(bookObj,review);

});

const getBookDropDown  =  (formID) => {
    const jqueryStr = '#'+formID
    const text = $(jqueryStr).find(":selected").text();
    const strings = text.split(",");
    
    bookObj = {
        "name":strings[0],"author":strings[1],"publisher":strings[2]
    };
    return bookObj;
}






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllBooks = async () => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");

    var books = await collBooks.find({});
    for(let i = 0 ; i < books.length ; i++){
        delete books[i]["_id"];
        delete books[i]["ratersJSON"];
        }
    // console.log("getAllBoooks called");
    // console.log(books);
    renderAllBooks(books);
}

function renderAllBooks(books) {

    if (books.length > 0){
        keys = Object.keys(books[0]);
        const    colNum = keys.length
        const    rowNum = books.length;
        let table = document.getElementById("allBooks");
    
        let center = document.createElement('center');
        let tbl = document.createElement('table');
        tbl.setAttribute('border', '1');
        let tbdy = document.createElement('tbody');
      
        //create thead
        let thead = document.createElement('thead');
        for (let j = 0; j < colNum; j++) {
          let th = document.createElement('th');
          th.setAttribute("scope","col");
          th.textContent = keys[j];
          thead.appendChild(th);
        }
          tbl.appendChild(thead);
      
        // create tbody
        for (let i = 0; i < rowNum; i++) {
          let tr = document.createElement('tr');
        //   const values = Object.values(books[i]);
          for (let j = 0; j < colNum; j++) {
            let td = document.createElement('td');
            td.setAttribute("scope","row");
            if (books[i][keys[j]]){
                td.textContent = books[i][keys[j]];
            }
            else{
    
            }
            td.style.fontSize='11px';
            tr.appendChild(td);
          }
          tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
        center.appendChild(tbl)
    
        table.append(center);
    
    }
  }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function tableCreate(header,userAtrs,userAtrVals) {

    colNum = header.length
    rowNum = userAtrs.length

    let table = document.getElementById("profileTable");
    let center = document.createElement('center');

    let tbl = document.createElement('table');
    tbl.setAttribute('border', '1');
    let tbdy = document.createElement('tbody');
  
    //create thead
    let thead = document.createElement('thead');
    for (let j = 0; j < colNum; j++) {
      let th = document.createElement('th');
      th.setAttribute("scope","col");
      th.textContent = header[j];
      thead.appendChild(th);
    }
      tbl.appendChild(thead);
  
    // create tbody
    for (let i = 0; i < rowNum; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < colNum; j++) {
        let td = document.createElement('td');
        td.setAttribute("scope","row");
        if (j===0){
  
            td.textContent = userAtrs[i];
            td.style.fontSize = '16px';
            tr.appendChild(td);
        }
        else{
            td.textContent = userAtrVals[i];
            td.style.fontSize='11px';
            tr.appendChild(td);
        }
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    center.appendChild(tbl)
    table.appendChild(center);

  }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



getAllBooks();
getAllBooks2("selectBookForm");
getAllBooks2("selectFavForm");
getAllBooks2("selectReviewForm");
buildProfilePage();




















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


