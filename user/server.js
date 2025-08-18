const http = require('http') ;
const app = require('./app') ;

const server = http.createServer(app) ;


server.listen(3001 , () =>{
    console.log("User Server is running on port 3001")
}) ;