const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const appointments = require('./appointments.js')
const staff = require('./staff.js')
const patients = require('./patients.js')

//Import the mongoose module
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
// var staffSchema = mongoose.model('staff').schema;
// const StaffSchema = require('../schemas/staff.js');
const staffSchema = require('../schemas/staff');
const patientSchema = require('../schemas/patient');
const appointmentsSchema = require('../schemas/appointments');

//Set up default mongoose connection
const mongoDB = 'mongodb://josh:Pa55word!@ds251807.mlab.com:51807/gp-db-13118866';
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;


//schema
// var staffSchema = new mongoose.Schema({
//     forename: String,
//     surname: String,
//     staff_role: Number,
//     user_name: String,
//     password: String
// });

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('Connected to MongoDB server via mongoose.');
});

router.use('/appointments', appointments);
router.use('/staff', staff);
router.use('/patients', patients);

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

router.post('/login', (req, res) => {
    const user = req.body;
    const token = jwt.sign({ user }, '13118866' );
    res.json({
        token: token
    });
});

router.get('/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, '13118866', (err, data) => {
        console.log(data);
        if( err ) {
            res.sendStatus(403);
        } else {
            res.json({
                text: 'protected shit bro',
                data: data
            });
        }
    });
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if( typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

// STAFF COLLECTION
// var staffModel = mongoose.model('staff', staffSchema, 'staff');

var testStaff = {
    staff_id: 50,
    forename: 'josh',
    surname: 'hazlewood',
    staff_role: 10,
    user_name: 'joshhaz',
    password: 'test'
};

// staffModel.create(testStaff, function(err) {
//     if (err) return handleError(err)
//     console.log("added to staff collection");
// })

// var patientModel = mongoose.model('patients', patientSchema, 'patients');

var testPatient = {
    patient_id: 100,
    forename: 'test',
    surname: 'hazlewood',
    address: [{
        line1: '2b',
        line2: 'davenport ave',
        town_city: 'manchester',
        postcode: 'M20 3EY'
    }],
    clinical_notes: [{
        diagnosis: 'he\'s a sick cunt',
        notes: 'loads of notes here',
        last_accessed: new Date(),
        last_accessed_by: 10,
        medications: [{
            name: 'lisinopril',
            amount: '5',
            unit: 'mg/day'
        }, {
            name: 'test_med',
            amount: '5',
            unit: 'mg/day'
        }]
    }],
    user_name: 'joshhaz',
    password: 'testPass'
}

// patientModel.create(testPatient, function(err) {
//     if (err) {
//         console.log('Error Inserting New Patient Data');
//         if (err.name == 'ValidationError') {
//             for (field in err.errors) {
//                 console.log(err.errors[field].message);
//             }
//         }
//     } else {
//         console.log('added to patients collection')
//     }
// })



module.exports = router;