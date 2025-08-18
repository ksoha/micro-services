const mongoose = require('mongoose') ;

function connect() {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Connected to the database successfully")
    }).catch(err => {
        console.error("Database connection error:" , err)
    }) ;
}

module.exports = connect ; 