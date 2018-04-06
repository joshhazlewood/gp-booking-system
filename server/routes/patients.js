// 
//  TODO:
//      - Implement JWT middleware for routes
//      - Fix client side logging in. 
// 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const PatientSchema = require('../schemas/patient');

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

var patientModel = mongoose.model('Patient', PatientSchema, 'patients');
var testPatient = {
    // patient_id: 100,
    forename: 'test',
    surname: 'patient',
    address: {
        line1: '2B',
        line2: 'Davenport Ave',
        town_city: 'Manchester',
        postcode: 'M20 3EY'
    },
    clinical_notes: {
        diagnosis: 'he\'s sick',
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
    user_name: 'test@gmail.com',
    password: 'testPass'
}

router.get('/all-patients', ensureAndVerifyToken, (req, res) => {
    resetResponse();
    patientModel.find({}, 'patient_id forename surname', function (err, patients) {
        if (!err) {
            if (patients === null) {
                response.status = 404;
                response.data = null;
                res.json(response);
            } else {
                response.status = 200;
                response.data = patients;
                res.json(response);
            }
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
});

router.get('/patient-notes/:id', ensureAndVerifyToken, (req, res) => {
    resetResponse();
    patientModel.findById({ _id: req.params.id }, '-password', function (err, patients) {
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
            console.log('Found patient notes with ID: ' + req.params.id);
        } else {
            console.log('No patient notes are found with an ID of ' + req.params.id);
        }
    })).catch(err => {
        console.log(err);
    })
});

router.post('/patient-notes/:id', ensureAndVerifyToken, (req, res) => {
    resetResponse();
    patientModel.findByIdAndUpdate({ _id: req.params.id },
        { $set: { clinical_notes: req.body } },
        { new: true }, function (err, patient) {
            if (err) {
                console.log(err);
                response.status = 404;
                response.data = null;
                res.json(response);
            }
            response.status = 200;
            response.data = null;
            res.json(response);
        }
    );
});

router.get('id/:id', ensureAndVerifyToken, (req, res) => {
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
});

router.post('/new-patient', (req, res) => {
    resetResponse();

    const { forename, surname, username, line1, line2, townCity, postcode } = req.body;

    // var patient Model = mongoose.model("patient", patientSchema);
    var newPatient = new patientModel({
        // patient_id: 100,
        forename: forename,
        surname: surname,
        address: {
            line1: line1,
            line2: line2,
            town_city: townCity,
            postcode: postcode
        },
        clinical_notes: {
            diagnosis: '',
            notes: '',
            medications: []
        },
        user_name: username,
        password: 'testPass'
    });

    newPatient.save({ setDefaultsOnInsert: true }, function (err, resp) {
        if (err) {
            console.log(err);
            response.status = 404;
            response.data = null;
            res.json(response);
        } else {
            response.status = 200;
            response.data = null;
            res.json(response);
        }
    });
});

router.post('/login', (req, res) => {
    resetResponse();
    const user = req.body;
    const username = user.username;
    const password = user.password;
    patientModel.findOne({ 'user_name': username }, (err, patient) => {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (patient === null) {
                response.status = 404;
                response.data = null;
                res.json(response);
            } else { // continue with response if it's found
                if (password === patient.password) {
                    // Expires in 30mins for patients
                    const expiresIn = (60 * 30);
                    let tokenData = JSON.stringify({
                        user_id: patient._id,
                        // user_name: username,
                        // pretty_id: patient.patient_id,
                        user_role: 'patient'
                    });

                    const token = jwt.sign(
                        {
                            data: tokenData
                        },
                        '13118866',
                        {
                            expiresIn
                        }
                    );

                    response.status = 200;
                    response.data = {
                        id_token: token,
                        expires_in: expiresIn
                    }
                    res.json(response);
                } else {
                    response.status = 401;
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

router.get('/user-data/:id', ensureAndVerifyToken, function (req, res) {
    resetResponse();
    const id = req.params.id;
    let idIsValid = mongoose.Types.ObjectId.isValid(id);
    if (idIsValid) {
        patientModel.findById({ _id: req.params.id }, '_id patient_id user_name', function (err, patient) {
            if (err) {
                handleError(err);
                response.status = 404;
                response.data = null;
                res.json(response);
            } else {
                response.status = 200;
                response.data = patient;
                res.json(response);
            }
        })
            .catch(err => {
                handleError(err);
            });
    } else {
        response.status = 422;
        response.data = null;
        response.message = "Incorrect format for user_id";
        res.json(response);
    }
});

router.get('/patient/:id', ensureAndVerifyToken, (req, res) => {
    resetResponse();
    const id = req.params.id;
    const idIsValid = mongoose.Types.ObjectId.isValid(id);

    if (idIsValid) {
        patientModel.findById({ _id: id }, '-password -clinical_notes', function (err, patient) {
            if (err) {
                handleError(err);
                response.status = 404;
                response.data = null;
                res.json(response);
            } else {
                response.status = 200;
                response.data = patient;
                res.json(response);
            }
        });
    }

});

router.post('/patient/:id', ensureAndVerifyToken, (req, res) => {
    resetResponse();

    const { _id, forename, surname, username, address } = req.body;

    patientModel.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                forename: forename,
                surname: surname,
                user_name: username,
                address: address
            }
        },
        { new: true }, function (err, patient) {
            if (err) {
                console.log(err);
                response.status = 404;
                response.data = null;
                res.json(response);
            }
            response.status = 200;
            response.data = null;
            res.json(response);
        }
    );
});

router.get('/protected', ensureAndVerifyToken, (req, res) => {
    resetResponse();
    jwt.verify(req.token, '13118866', (err, data) => {
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

function ensureAndVerifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, '13118866', (err, data) => {
            if (err) {
                res.sendStatus(401);
            } else {
                console.log('verified token');
                next();
            }
        })
        // next();
    } else {
        res.sendStatus(403);
    }
}

//  WRITE MIDDLEWARE TO CHECK USERTYPE=DOCTOR/ADMIN BEFORE

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
// });


module.exports = router;
