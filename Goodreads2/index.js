const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
var cors = require('cors')

const port = process.env.PORT || 5000 ;                  //Save the port number where your server will be listening

app.use("/public", express.static(__dirname + '/public'))
app.use(cors())

console.log(__dirname)

/*  get requests to the root ("/") will route here
server responds by sending the index.html file to the client's browser
*/
app.get('/', (req, res) => {       
    res.sendFile('/public/index.html', {root: __dirname});      
                                                         
});

/* server starts listening for any attempts from a client to connect at port taken from heroku  */
app.listen(port, () => {            
    console.log(`Now listening on port ${port}`); 
});
