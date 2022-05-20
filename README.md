# Ceng495-Cloud-THE2

HERE IS THE WEBSITE LINK:

https://rhea-goodreads-app-sawog.mongodbstitch.com/

**DEVELOPMENT DECISIONS**

I am using Realm static hosting as the host of this server. That was one of the requirements of the program. I used mongodb realm's anonymous user to use the application. User needs to push to login button to login to the application.

Program has 3 pages. User is greeted with the home page. After logging in and adding a user. User can act as that user. User can use the * Set as User * form to sets himself/herself as that user by providing the desired username. By this option user can see different profile's properties.

**Profile Page:**

Profile page consists of a table providing users attributes. If the user has no rating or review or favorite book. These properties look empty. All reviews of the user as sorted as favorite books on top and regarding users rating for these reviewed book. User can not write a review if it is rated that book before. This is checked.

In profile page user can 
- select a book from all the book as dropdown and give a rating from 1-5. New ones overwrite previous.
- select a book from all the book as dropdown make it favorite.
- select a book from all the book as dropdown and make a review on that book.New ones overwrite previous.

Book selection is made from a dropdown of all books in the database. Because making it a form would be too cumbersome for user. After any action done by the user respective book attribute is updated in books page.

Dropdown shows the book name, author, publisher. More fields could be shown but it would decrease usability.

Authors can not rate or make review. If they try we alert the webpage with regardin messages.

**Books Page:**

Books page has a big table giving all information about each book. It shows all of received reviews and its rating average. 

Books Table in books.html and user attribute table in profile,html is rendered dynamically from the database values.Once some value changes in database this tables are changed. However you need to switch tabs to see the change because html pages does not re-render automatically.

If no user is selected using ** set as username **  form profile page does not show any profile user attributes table.

**HomePage:**

In homepage we can add/remove user by filling the form and submiting the regarding button. If you want to remove non existent username, we alert the website. After succesfull add and remove user is greated with a corresponding alert. 

While removing a user, we update 
- its rated books numOfUser 
- its rated books ratingAveragge
- all books that this user reviewed updates its reviews. 
- RatersJSON field, which represents which user is rated this book with rate. Book is updated.

In homepage we can add/remove a book by filling the form and submiting the regarding button. If you want to remove non existent book, we alert the website. After succesfull add and remove user is greated with a corresponding alert. 

While removing a book, we update 
- booksReadCount of users whom rated this book
- givenRatingsAvrg which represents users average rate given to books
- all reviews that this book has from which users. User is updated. Reviews are sorted automatically again of these users and shown in profile page if this user is selected.

# Database Design

I have two collections called. "users" and "books"

**Users**
- id : represents uniquely this document
- username: unique username of the user
- booksReadCount: integer representing rated book count
- favBooks: favorite books of user as array. At max 1 book can be favorite. Coded as an array to later be extended easily to a bigger queue.
- givenRatingsAvrg: average rating given by this user as float
- givenReviews: reviews as an array, each element of this array has the following properties: [ [ bookId, review, bookname] ...]

**Books**
- id: represents uniquely this document
- name: string book name
- author: array authors
- editor : array editors 
- translator: array translators
- cover: string link of cover
- publisher: string publisher
- numOfUsers: int num of user rated this book
- isFiction: boolean 
- yearPublished: Date
- ratingAverage: average rate this book has
- allReviews: array consisting of review, format: [ [username1,review1 ] , [username2,review2 ] ... ]
- ratersJSON : JSON object having username: rate key value pairs, { "username1": givenRateValue , "username2": givenRateValue2   }
- Genre: enum of the following 6 options [crime, fantasy, science-fiction, romance, horror, drama]


All regarded updates when adding removing books,user. Making reviews and rates findOne and updateOne methods of mongodb is used with _id key.
Two users:

[
  {
    _id: ObjectId("6287f79040560ffa02658e95"),
    username: 'timothy',
    booksReadCount: 10,
    favBooks: [],
    givenRatingsAvrg: 2.8,
    givenReviews: [
      [
        ObjectId("6287f2d940560ffa02653602"),
        'This was my last read of 2017 and one which I purchased just before Christmas.  I bought it based on another book bloggers review (and it was such the loveliest Christmas read.',
        'Harry Potter and Philosopher Stone'
      ],
      [
        ObjectId("6287f2d940560ffa02653602"),
        'this is amazing',
        'Harry Potter and Philosopher Stone'
      ],
      [
        ObjectId("6287f4c73155d455a3db95da"),
        'this is amazing',
        'Açlık Oyunları 1'
      ],
      [
        ObjectId("6287f9e7d0df270d4c60f3cd"),
        'this is amazing',
        'This Time Tomorrow: A Novel'
      ],
      [
        ObjectId("6287fa53e7c15e155de85219"),
        'this is amazing',
        'The Midnight Library'
      ],
      [
        ObjectId("6287fadae7c15e155de85c3f"),
        'this is amazing',
        'Burn After Writing'
      ],
      [
        ObjectId("6287fb2794c80f7c64e7700f"),
        'this is amazing',
        'Sparring Partners'
      ],
      [
        ObjectId("6287fb9840560ffa0265d484"),
        'this is amazing',
        'Cracking the Coding Interview: 189 Programming Questions and Solutions'
      ],
      [
        ObjectId("6287fbd6cd80b56da6badae0"),
        'this is amazing',
        'Just Tyrus: A Memoir'
      ],
      [
        ObjectId("6287fc133155d455a3dc1a18"),
        'this is amazing',
        'Love You Forever'
      ]
    ],
    isAuthor: false
  },
  {
    _id: ObjectId("6287f816e7c15e155de82ae8"),
    username: 'Suzanne Collins',
    booksReadCount: 3,
    favBooks: [],
    givenRatingsAvrg: 2,5,
    givenReviews: [  ObjectId("6287fc133155d455a3dc1a18"),
        'this is amazing',
        'Love You Forever'],
    isAuthor: true
  }
]


12 books:

[
  {
    _id: ObjectId("6287f2d940560ffa02653602"),
    name: 'Harry Potter and Philosopher Stone',
    author: [ 'J.K. Rowling' ],
    translator: [ '' ],
    editor: [ 'Richard Francis-Bruce' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51UDJ6EbhXL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
    isFiction: true,
    publisher: 'Bloomsbury',
    yearPublished: ISODate("2015-09-03T00:00:00.000Z"),
    ratingAverage: 3,
    numOfUsers: 3,
    allReviews: [
      [
        'aryaStark',
        'I love the Harry Potter series, & thought the paperback I ordered was the illustrated copy. Nope. Returning.'
      ],
      [ 'timothy', 'this is amazing' ],
      [ 'elonmuskk', 'review1Example' ]
    ],
    ratersJSON: { aryaStark: 4, timothy: 1, elonmuskk: 4 },
    genre: 'Fantasy'
  },
  {
    _id: ObjectId("6287f4c73155d455a3db95da"),
    name: 'Açlık Oyunları 1',
    author: [ ' Suzanne Collins' ],
    translator: [ ' Taylan Taftaf' ],
    editor: [ '' ],
    cover: 'https://i.dr.com.tr/cache/500x400-0/originals/0000000670359-1.jpg',
    isFiction: true,
    publisher: 'DEX',
    yearPublished: ISODate("2018-07-22T00:00:00.000Z"),
    ratingAverage: 2.6666666666666665,
    numOfUsers: 3,
    allReviews: [
      [ 'elonmuskk', 'review1Example' ],
      [ 'timothy', 'this is amazing' ]
    ],
    ratersJSON: { aryaStark: 2, timothy: 2, elonmuskk: 4 },
    genre: 'Fantasy'
  },
  {
    _id: ObjectId("6287f9e7d0df270d4c60f3cd"),
    name: 'This Time Tomorrow: A Novel',
    author: [ 'Emma Straub' ],
    translator: [ '' ],
    editor: [ '' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/41KHd0Uz2UL._SX329_BO1,204,203,200_.jpg',
    isFiction: true,
    publisher: 'Riverhead Books',
    yearPublished: ISODate("2022-04-07T00:00:00.000Z"),
    ratingAverage: 2,
    numOfUsers: 2,
    allReviews: [ [ 'timothy', 'this is amazing' ] ],
    ratersJSON: { aryaStark: 2, timothy: 2 },
    genre: 'Fantasy'
  },
  {
    _id: ObjectId("6287fa53e7c15e155de85219"),
    name: 'The Midnight Library',
    author: [ 'Matt Haig' ],
    translator: [ '' ],
    editor: [ '' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/41ATfFjhelL._SX329_BO1,204,203,200_.jpg',
    isFiction: true,
    publisher: 'Viking; 1st Edition',
    yearPublished: ISODate("2018-07-18T00:00:00.000Z"),
    ratingAverage: 2.3333333333333335,
    numOfUsers: 3,
    allReviews: [
      [ 'elonmuskk', 'review1Example' ],
      [ 'timothy', 'this is amazing' ]
    ],
    ratersJSON: { aryaStark: 2, timothy: 2, elonmuskk: 3 },
    genre: 'Fantasy'
  },
  {
    _id: ObjectId("6287fa9640560ffa0265c427"),
    name: 'Quicksilver',
    author: [ 'Dean Koontz' ],
    translator: [ '' ],
    editor: [ '' ],
    cover: 'https://m.media-amazon.com/images/I/51izX-4Y7gL.jpg',
    isFiction: true,
    publisher: 'Thomas & Mercer',
    yearPublished: ISODate("2022-03-09T00:00:00.000Z"),
    ratingAverage: 3.3333333333333335,
    numOfUsers: 3,
    allReviews: [ [ 'elonmuskk', 'review1Example' ] ],
    ratersJSON: { aryaStark: 4, timothy: 3, elonmuskk: 3 },
    genre: 'Science-Fiction'
  },
  {
    _id: ObjectId("6287fadae7c15e155de85c3f"),
    name: 'Burn After Writing',
    author: [ 'Sharon Jones' ],
    translator: [ '' ],
    editor: [ 'tim hardstone' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/31Xe0xltrgS._SX330_BO1,204,203,200_.jpg',
    isFiction: true,
    publisher: 'Penguin Publishing Group',
    yearPublished: ISODate("2020-06-30T00:00:00.000Z"),
    ratingAverage: 3.3333333333333335,
    numOfUsers: 3,
    allReviews: [ [ 'timothy', 'this is amazing' ] ],
    ratersJSON: { aryaStark: 4, timothy: 3, elonmuskk: 3 },
    genre: 'Romance'
  },
  {
    _id: ObjectId("6287fb2794c80f7c64e7700f"),
    name: 'Sparring Partners',
    author: [ 'John Grisham' ],
    translator: [ '' ],
    editor: [ 'David Michael Hardaway' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/41HE+g156iL._SX327_BO1,204,203,200_.jpg',
    isFiction: false,
    publisher: 'Doubleday',
    yearPublished: ISODate("2022-05-12T00:00:00.000Z"),
    ratingAverage: 3,
    numOfUsers: 3,
    allReviews: [
      [ 'elonmuskk', 'review1Example' ],
      [ 'timothy', 'this is amazing' ]
    ],
    ratersJSON: { aryaStark: 4, timothy: 3, elonmuskk: 2 },
    genre: ''
  },
  {
    _id: ObjectId("6287fb9840560ffa0265d484"),
    name: 'Cracking the Coding Interview: 189 Programming Questions and Solutions',
    author: [ 'Gayla Laakmann Mcdowell ' ],
    translator: [ '' ],
    editor: [ '' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/41oYsXjLvZL._SX348_BO1,204,203,200_.jpg',
    isFiction: false,
    publisher: 'CareerCup; 6th edition',
    yearPublished: ISODate("2015-06-18T00:00:00.000Z"),
    ratingAverage: 2.6666666666666665,
    numOfUsers: 3,
    allReviews: [
      [ 'elonmuskk', 'review1Example' ],
      [ 'timothy', 'this is amazing' ]
    ],
    ratersJSON: { aryaStark: 2, timothy: 4, elonmuskk: 2 },
    genre: ''
  },
  {
    _id: ObjectId("6287fbd6cd80b56da6badae0"),
    name: 'Just Tyrus: A Memoir',
    author: [ 'Tyrus' ],
    translator: [ '' ],
    editor: [ '' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51NYS363lkS._SX334_BO1,204,203,200_.jpg',
    isFiction: false,
    publisher: 'Post Hill Press',
    yearPublished: ISODate("2022-05-18T00:00:00.000Z"),
    ratingAverage: 3,
    numOfUsers: 3,
    allReviews: [
      [ 'elonmuskk', 'review1Example' ],
      [ 'timothy', 'this is amazing' ]
    ],
    ratersJSON: { aryaStark: 3, timothy: 4, elonmuskk: 2 },
    genre: ''
  },
  {
    _id: ObjectId("6287fc133155d455a3dc1a18"),
    name: 'Love You Forever',
    author: [ 'Robert Munsch' ],
    translator: [ '' ],
    editor: [ 'Sheila Mcgrow' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/61k5YUaOrZL._SY498_BO1,204,203,200_.jpg',
    isFiction: false,
    publisher: '‎ Firefly Books',
    yearPublished: ISODate("1997-06-11T00:00:00.000Z"),
    ratingAverage: 2.3333333333333335,
    numOfUsers: 3,
    allReviews: [
      [ 'elonmuskk', 'review1Example' ],
      [ 'timothy', 'this is amazing' ]
    ],
    ratersJSON: { aryaStark: 2, timothy: 4, elonmuskk: 1 },
    genre: ''
  },
  {
    _id: ObjectId("6287fde740560ffa0265f988"),
    name: 'Deep Learning (Adaptive Computation and Machine Learning series)',
    author: [ 'Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville' ],
    translator: [ '' ],
    editor: [ '' ],
    cover: 'https://images-na.ssl-images-amazon.com/images/I/61qbj4KwauL._SX218_BO',
    isFiction: false,
    publisher: 'The MIT Press',
    yearPublished: ISODate("2016-10-04T00:00:00.000Z"),
    ratingAverage: 3,
    numOfUsers: 2.66666,
    allReviews: [      [ 'elonmuskk', 'review1Example' ],
      [ 'timothy', 'this is amazing' ]],
    ratersJSON: {aryaStark: 2, timothy: 4, elonmuskk: 1},
    genre: ''
  }
]



