const express = require('express');
const router = express.Router();

const appointments = require('./appointments.js')
const patients = require('./patients.js')
const staff = require('./staff.js')

//Import the mongoose module
const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = 'mongodb://josh:Pa55word!@ds251807.mlab.com:51807/gp-db-13118866';

mongoose.connect(mongoDB);

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Connected to DB');
  });

router.use('/appointments', appointments);

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

// Get users - early db -> express testing
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

module.exports = router;
