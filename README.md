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
