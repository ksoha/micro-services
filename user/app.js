const dotenv = require('dotenv') ;
dotenv.config() ;
const express = require('express') 
const app = express() ; 
const userRoute = require('./routes/user.routes') ;
const cookieParser = require('cookie-parser') ;
const mongoose = require('mongoose') ;
const connect = require('./db/db') ;
connect() ;
const rabbitMq = require('./service/rabbit')

rabbitMq.connect() 

app.use(express.json()) ;
app.use(express.urlencoded({ extended: true})) ;
app.use(cookieParser()) ;


app.use('/' , userRoute) ;


module.exports = app;