// 
//  TODO:
//      - Implement JWT middleware for routes
//      - Fix client side logging in. 
// 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const patientSchema = require('../schemas/patient');

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

var patientModel = mongoose.model('patients', patientSchema, 'patients');
var testPatient = {
    // patient_id: 100,
    forename: 'test',
    surname: 'hazlewood',
    address: {
        line1: '2b',
        line2: 'davenport ave',
        town_city: 'manchester',
        postcode: 'M20 3EY'
    },
    clinical_notes: {
        diagnosis: 'he\'s a sick cunt',
        notes: 'loads of notes here',
        last_accessed: new Date(),
        last_accessed_by: 10,
        medications: [
            {
                name: 'lisinopril',
                amount: '5',
                unit: 'mg/day'
            }, {
                name: 'test_med',
                amount: '5',
                unit: 'mg/day'
            }
        ]
    },
    user_name: 'joshhaz',
    password: 'testPass'
}

router.get('/all-patients', ensureToken, function (req, res) {
    resetResponse();
    patientModel.find({}, function (err, patients) {
        if (!err) {
            response.data = patients;
            res.json(response);
        } else {
            console.log(err);
        }
    }).then((patients) => {
        console.log('Found patients.');
    }).catch(err => {
        console.log(err);
    });
})

router.get('id/:id', function (req, res) {
    resetResponse();
    patientModel.findOne({ 'patient_id': req.params.id }, function (err, patients) {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (patients === null) {
                response.status = 404;
                response.data = null;
                res.json(response);
            } else { // continue with response if it's found
                response.status = 200;
                response.data = patients;
                res.json(response);
            }
        } else {
            console.log(err);
        }
    }).then((patients => {
        if (patients !== null) {
            console.log('Found patient with ID: ' + req.params.id);
        } else {
            console.log('No patient is found with an ID of ' + req.params.id);
        }
    })).catch(err => {
        console.log(err);
    })
})

router.post('/new-patient', (req, res) => {
    resetResponse();
    const patient = req.body;

    patientModel.create(patient, (err) => {
        if (err) {
            console.log('Error saving patient data');
        } else {
            res.send('Patient saved to DB');
        }
    });
});

router.post('/login', (req, res) => {
    resetResponse();
    const user = req.body;
    const username = user.username
    const password = user.password

    patientModel.findOne({ 'user_name': username }, function (err, patient) {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (patient === null) {
                response.status = 404;
                response.data = null;
                response.message = `Username ${username} not found`;
                res.json(response);
            } else { // continue with response if it's found
                if (password === patient.password) {
                    expiresAt = Math.floor(Date.now() / 1000) + (60 * 30);
                    const token = jwt.sign({
                        exp: expiresAt,
                        data: { user_name: username }
                    }, '13118866');

                    response.status = 200;
                    response.message = `User ${patient.user_name} logged in.`;
                    response.data = token;

                    res.json(response);
                } else {
                    response.status = 401;
                    response.data = "Incorrect password.";
                    res.json(response);
                }
            }
        } else {
            console.log(err);
        }
    })
        .catch(err => {
            console.log(err);
        })
});

router.get('/protected', ensureToken, (req, res) => {
    resetResponse();
    jwt.verify(req.token, '13118866', (err, data) => {
        console.log(data);
        if (err) {
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
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

function resetResponse() {
    response.status = 200;
    response.data = [];
    response.message = null;
}

// patientModel.create(testPatient, function (err) {
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
