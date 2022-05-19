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
$('#addBookForm').submit(function(event) {
    // get all the inputs into an array.
    event.preventDefault();

    $_name= $('#addBookName').val();
    $_author= $('#addAuthorName').val();
    $_translator= $('#addTranslatorName').val();
    $_editor= $('#addEditorName').val();
    $_publisher= $('#addPublisherName').val();
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
        "ratersJSON": {"default":0}
    }

    // User selected fiction
    if ($_isFiction){
        obj["isFiction"] = true;
        obj["genre"] = $_genre
    }

    addBook(obj)
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const getAllBooks2 = async () => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");

    const books = await collBooks.find({});
    renderBooksDropDown(books);
}

const renderBooksDropDown = (books) => {
    var form = document.getElementById("selectBookForm");
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













///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllBooks = async () => {
    let collBooks = await getCollectionByLogin("goodreads_db","books");

    const books = await collBooks.find({});
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
getAllBooks2();
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


