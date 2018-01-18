const express = require('express');
const router = express.Router();
// const MongoClient = require('mongodb').MongoClient;
// const ObjectID = require('mongodb').ObjectID;

//Import the mongoose module
var mongoose = require('mongoose');
// var staffSchema = mongoose.model('staff').schema;
require('../schemas/staff.js');

//Set up default mongoose connection
var mongoDB = 'mongodb://josh:Pa55word!@ds251807.mlab.com:51807/gp-db-13118866';

mongoose.connect(mongoDB, {
  useMongoClient: true
});

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Connected to DB');
  });

// Connect
// const connection = (closure) => {
//     return MongoClient.connect('mongodb://joshhaz:Pa55word!@ds247407.mlab.com:47407/gp-db-13118866', (err, client) => {
//         if (err) return console.log(err);

        
//         var db = client.db('gp-db-13118866');
//         closure(db);
//     });
// };

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {    
    db.collection('users')
    .find()
    .toArray()
    .then((users) => {
        response.data = users;
        res.json(response);
    })
    .catch((err) => {
        sendError(err, res);
    });
});

// STAFF COLLECTION

var testStaff = new staffSchema({
    forname : 'josh',
    surname : 'hazlewood',
    staff_role: 10,
    user_name : 'joshhaz',
    password : 'test'
});

testStaff.create(function (err) {
    if (err) return handleError(err); // saved!  
    console.log('Saved to staff collection');
})

module.exports = router;