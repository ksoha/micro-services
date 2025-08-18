const dotenv = require('dotenv') ;
dotenv.config() ;
const express = require('express') 
const app = express() ; 
const captainRoute = require('./routes/captain.routes') ;
const cookieParser = require('cookie-parser') ;
const mongoose = require('mongoose') ;
const connect = require('./db/db') ;
connect() ;
const rabbitMq =  require('./service/rabbit') ;
rabbitMq.connect() ;

app.use(express.json()) ;
app.use(express.urlencoded({ extended: true})) ;
app.use(cookieParser()) ;


app.use('/' , captainRoute) ;


module.exports = app;