# Ceng495-Cloud-THE2

HERE IS THE WEBSITE LINK:

https://rhea-goodreads-app-sawog.mongodbstitch.com/

DEVELOPMENT DECISIONS

I am using Realm static hosting as the host of this server. That was one of the requirements of the program. I used mongodb realm's anonymous user to use the application. User needs to push to login button to login to the application.

Program has 3 pages. User is greeted with the home page. After logging in and adding a user. User can act as that user. User can use the * Set as User * form to sets himself/herself as that user by providing the desired username. By this option user can see different profile's properties.

Profile page consists of a table providing users attributes. If the user has no rating or review or favorite book. These properties look empty. All reviews of the user as sorted as favorite books on top and regarding users rating for these reviewed book. User can not write a review if it is rated that book before. This is checked.

In profile page user can 
- select a book from all the book as dropdown and give a rating from 1-5. New ones overwrite previous.
- select a book from all the book as dropdown make it favorite.
- select a book from all the book as dropdown and make a review on that book.New ones overwrite previous.

Book selection is made from a dropdown of all books in the database. Because making it a form would be too cumbersome for user. After any action done by the user respective book attribute is updated in books page.

Books page has a big table giving all information about each book. It shows all of received reviews and its rating average. 

Books Table in books.html and user attribute table in profile,html is rendered dynamically from the database values.Once some value changes in database this tables are changed. However you need to switch tabs to see the change because html pages does not re-render automatically. If no user is selected using

# Database Design





