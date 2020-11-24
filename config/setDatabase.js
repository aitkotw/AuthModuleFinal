const mongoose = require("mongoose");
const db = require("./keys").mongoURI;

const database = (req, res, next) => {
    //Database Connection
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if(!err){
            console.log('Connection Success')
            next()
        } else{
            console.log(err)
            res.json({Error: 'Server Connection Error'})
            next()
        }
    });
}

module.exports = database

