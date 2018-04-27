const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const Response = require('../response');
const staffSchema = require('../schemas/staff');
var staff = mongoose.model('staff', staffSchema, 'staff');
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, simple } = format;

const PatientSchema = require('../schemas/patient');
var patientModel = mongoose.model('Patient', PatientSchema, 'patients');

const customLevels = {
    levels: {
        accessed: 1,
        changed: 0
    }
}

const accessLogger = winston.createLogger({
    level: 'accessed',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    levels: customLevels.levels,
    transports: [
        new winston.transports.File({
            filename: 'access.log',
            level: 'accessed'
        }),
        new winston.transports.File({
            filename: './logs/changed.log',
            level: 'changed'
        })
    ]
});

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
        format.splat(),
        format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'info.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'warning.log',
            level: 'warn'
        })
    ]
});


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

router.get('/all-patients', ensureAndVerifyToken, ensureStaffMember, (req, res) => {
    patientModel.find({}, 'patient_id forename surname', function (err, patients) {
        if (!err) {
            if (patients.length === 0) {
                const resp = new Response(404);
                res.json(resp);
            } else {
                const resp = new Response(200, patients);
                res.json(resp);
            }
        } else {
            console.log(err);
            const resp = new Response(500);
        }
    }).then((patients) => {
        console.log('Found patients.');
    }).catch(err => {
        console.log(err);
    });
});

router.get('/patient-notes/:id/:staffId', ensureAndVerifyToken, ensureStaffMember, (req, res) => {
    const staffId = req.params.staffId;
    let staffUsername = null;
    let staffRole = null;

    staff.findById({ _id: staffId }, 'user_name staff_role', function (err, staffMember) {
        if (err) {
            console.log(err);
        } else {
            staffUsername = staffMember.user_name;
            staffRole = staffMember.staff_role;
        }
    });

    patientModel.findById({ _id: req.params.id }, '-password', function (err, patients) {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (patients === null) {
                const resp = new Response(404);
                res.json(resp);
            } else { // continue with response if it's found
                if (staffUsername !== null && staffRole !== null) {
                    const message = `${staffRole} ${staffUsername} accessed patient ${patients.user_name} notes.`;
                    accessLogger.accessed(message);
                }
                const resp = new Response(200, patients);
                res.json(resp);
            }
        } else {
            console.log(err);
            const resp = new Response(500);
            res.json(resp);
        }
    });
});

router.post('/patient-notes/:id/:staffId', ensureAndVerifyToken, ensureStaffMember, (req, res) => {
    const staffId = req.params.staffId;
    let staffUsername = null;
    let staffRole = null;

    staff.findById({ _id: staffId }, 'user_name staff_role', function (err, staffMember) {
        if (err) {
            console.log(err);
        } else {
            console.log(staffMember);
            staffUsername = staffMember.user_name;
            staffRole = staffMember.staff_role;
        }
    });

    patientModel.findByIdAndUpdate({ _id: req.params.id },
        { $set: { clinical_notes: req.body } },
        { new: true }, function (err, patient) {
            if (err) {
                const resp = new Response(404);
                res.json(resp);
            }
            const changedMessage = `${staffRole} ${staffUsername} modified patient ${patient.user_name} notes.`;
            accessLogger.changed(changedMessage);
            const resp = new Response(200);
            res.json(resp);
        }
    );
});

router.get('id/:id', ensureAndVerifyToken, ensureStaffMember, (req, res) => {
    patientModel.findOne({ 'patient_id': req.params.id }, function (err, patients) {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (patients === null) {
                const resp = new Response(404);
                res.json(resp);
            } else { // continue with response if it's found
                const resp = new Response(200, patients);
                res.json(resp);
            }
        } else {
            const resp = new Response(500);
            res.json(resp);
        }
    }).then((patients => {
        if (patients !== null) {
            console.log('Found patient with ID: ' + req.params.id);
        } else {
            console.log('No patient is found with an ID of ' + req.params.id);
        }
    })).catch(err => {
        logger.log('error', err);
    })
});

router.post('/new-patient', ensureAndVerifyToken, ensureAdmin, (req, res) => {

    const { forename, surname, username, line1, line2, townCity, postcode, password } = req.body;

    const saltRounds = 10;
    var hash = bcrypt.hashSync(password, saltRounds);

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
        password: hash
    });

    newPatient.save({ setDefaultsOnInsert: true }, function (err, resp) {
        if (err) {
            logger.log('error', err);
            const resp = new Response(409);
            res.json(resp);
        } else {
            const resp = new Response(200);
            res.json(resp);
        }
    });
});

router.post('/login', (req, res) => {
    const user = req.body;
    const username = user.username;
    const password = user.password;
    patientModel.findOne({ 'user_name': username }, (err, patient) => {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (patient === null) {
                const resp = new Response(404);
                res.json(resp);
            } else { // continue with response if it's found
                const hash = patient.password;
                const passwordMatches = bcrypt.compareSync(password, hash);
                if (passwordMatches) {
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

                    data = {
                        id_token: token,
                        expires_in: expiresIn
                    }

                    logger.log('info', 'User %s logged in.', username);

                    const resp = new Response(200, data);
                    res.json(resp);
                } else {
                    logger.log('warn', 'User %s attemped to log in.', username);
                    const resp = new Response(401);
                    res.json(resp);
                }
            }
        } else {
            logger.log('error', err);
            console.log(err);
        }
    })
        .catch(err => {
            console.log(err);
        })
});

router.get('/user-data/:id', ensureAndVerifyToken, function (req, res) {
    const id = req.params.id;
    let idIsValid = mongoose.Types.ObjectId.isValid(id);
    if (idIsValid) {
        patientModel.findById({ _id: req.params.id }, '_id patient_id user_name', function (err, patient) {
            if (err) {
                console.log(err);
                const resp = new Response(404);
                res.json(resp);
            } else {
                const resp = new Response(200, patient);
                res.json(resp);
            }
        })
            .catch(err => {
                handleError(err);
            });
    } else {
        const data = null;
        const message = "Incorrect format for user_id";
        const resp = new Response(422, message);
        res.json(resp);
    }
});

router.get('/patient/:id', ensureAndVerifyToken, ensureStaffMember, (req, res) => {
    const id = req.params.id;
    const idIsValid = mongoose.Types.ObjectId.isValid(id);

    if (idIsValid) {
        patientModel.findById({ _id: id }, '-password -clinical_notes', function (err, patient) {
            if (err) {
                console.log(err);
                const resp = new Response(404);
                res.json(resp);
            } else {
                const resp = new Response(200, patient);
                res.json(resp);
            }
        });
    }

});

router.patch('/patient/:id', ensureAndVerifyToken, ensureStaffMember, (req, res) => {

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
                const resp = new Response(404);
                res.json(resp);
            }
            const resp = new Response(200);
            res.json(resp);
        }
    );
});

router.get('/protected', ensureAndVerifyToken, ensureStaffMember, (req, res) => {
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

function ensureStaffMember(req, res, next) {
    const decodedToken = jwt.decode(req.token);
    const parsedToken = JSON.parse(decodedToken['data']);
    const user_role = parsedToken.user_role;
    const userIsStaffMember = (user_role === 'doctor' || user_role === 'admin');

    if (userIsStaffMember) {
        next();
    } else {
        res.sendStatus(403);
    }
}

function ensureAdmin(req, res, next) {
    const decodedToken = jwt.decode(req.token);
    const parsedToken = JSON.parse(decodedToken['data']);
    const user_role = parsedToken.user_role;
    const userIsAdmin = user_role === 'admin';

    if (userIsAdmin) {
        next();
    } else {
        res.sendStatus(403);
    }
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
