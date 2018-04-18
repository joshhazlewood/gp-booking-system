const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const moment = require('moment-timezone');

var appointmentsSchema = require('../schemas/appointments');
var appointmentsModel = mongoose.model('appointments', appointmentsSchema, 'appointments');

var PatientSchema = require('../schemas/patient');
var Patient = mongoose.model('Patient', PatientSchema, 'patients');
const Response = require('../response');

const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, simple } = format;

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
            level: 'warning'
        })
    ]
});

// autoIncrement.initialize
autoIncrement.initialize(mongoose.connection);
appointmentsSchema.plugin(autoIncrement.plugin, {
    model: 'appointmentsModel',
    field: 'appointment_id',
    startAt: 1
});

router.get('/all-appointments', ensureToken, (req, res) => {
    appointmentsModel.find({}, function (err, appointments) {
        if (!err) {
            const resp = new Response(200, appointments);
            res.json(resp);
        } else {
            console.log(err);
            const resp = new Response(404);
            res.json(resp);
        }
    });
});


router.post('/new-appointment', ensureToken, function (req, res) {
    const appTaken = false;
    const { doctor, date, patient_id } = req['body'];
    const doc_id = doctor['_id'];

    const startTime = moment(date);
    const endTime = moment(date).add(30, 'm');

    const appointment = {
        patient: patient_id,
        staff: doc_id,
        start_time: startTime,
        end_time: endTime
    };

    appointmentsModel.find({
        'start_time': startTime
    },
        function (err, appointments) {
            if (err) {
                console.log(err);
                const resp = new Response(500);
                res.json(resp);
            }

            //  No other appointments at this time so create appointment
            if (appointments.length === 0) {
                appointmentsModel.create(appointment, function (err) {
                    if (err) {
                        // console.log('Error saving appointment data');
                        logger.log('error', 'Error saving appointment data %s', appointment);
                        const resp = new Response(500);
                        res.json(resp);
                    } else {
                        logger.log('info', 'User %s created an appointment at %s.', patient_id, startTime);
                        const resp = new Response(200);
                        res.json(resp);
                    }
                });
            } else {
                const doctorTaken = false;
                appointments.forEach(app => {
                    if (appointment.staff === app.staff) {
                        doctorTaken = true;
                    }
                });

                if (doctorTaken === true) {
                    console.log('Appointment already taken!');
                    logger.log('warning', 'Clash found for appointment data %s', appointment);
                    const resp = new Response(409);
                    res.json(resp);
                } else if (doctorTaken === false) {
                    appointmentsModel.create(appointment, function (err) {
                        if (err) {
                            logger.log('error', 'Error saving appointment data %s', appointment);
                            const resp = new Response(500);
                            res.json(resp);
                        } else {
                            logger.log('info', 'User %s created an appointment at %s.', patient_id, startTime);
                            const resp = new Response(200);
                            res.json(resp);
                        }
                    });
                }
            }
        });
});

router.get('/id/:id', function (req, res) {
    appointmentsModel.find({ 'appointment_id': req.params.id }, function (err, appointment) {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (appointment.length === 0) {
                const resp = new Response(404);
                res.json(resp);
            } else {
                // continue with response if it's found
                const resp = new Response(200, appointment);
                res.json(resp);
            }
        } else {
            console.log(err);
            const resp = new Response(500);
            res.json(resp);
        }
    });
});

router.get('/date/:date', function (req, res) {
    date = req.params.date;
    dateToFind = new moment(date);
    dateToFindPlusOneDay = new moment(date);
    dateToFindPlusOneDay = dateToFindPlusOneDay.add(1, 'd');

    appointmentsModel.find({ 'start_time': { '$gte': dateToFind.toDate(), '$lt': dateToFindPlusOneDay.toDate() } }, function (err, appointments) {
        if (!err) {
            if (appointments.length === 0) {
                const resp = new Response(404);
                res.json(resp);
            } else {
                // continue with response if it's found
                const resp = new Response(200, appointments);
                res.json(resp);
            }
        } else {
            console.log(err);
            const resp = new Response(500);
            res.json(resp);
        }
    });
});

router.get('/app-as-event/:doctor_id', ensureToken, (req, res) => {
    const doc_id = req.params.doctor_id;

    appointmentsModel.find({ 'staff': doc_id }).
        populate('patient', '_id forename surname').
        populate('staff', '_id forename surname').
        exec(function (err, appointments) {
            if (err) {
                console.log(err);
                const resp = new Response(500);
                res.json(resp);
            } else {
                // continue with response if it's found
                const resp = new Response(200, appointments);
                res.json(resp);
            }
        });
});

router.get('/patient/:patient_id', ensureToken, (req, res) => {
    const patient_id = req.params.patient_id;
    appointmentsModel.find({ patient: patient_id }).
        populate('staff', 'forename surname').
        exec(function (err, appointments) {
            if (err) {
                console.log(err);
                const resp = new Response(500);
                res.json(resp);
            }
            if (appointments.length > 0) {
                const resp = new Response(200, appointments);
                res.json(resp);
            } else {
                const resp = new Response(404, null, 'No appointments found by that _id');
                res.json(resp);
            }
        })
});

function handleError(err) {
    console.log(err);
}

router.get('/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, '13118866', (err, data) => {
        console.log(data);
        if (err) {
            const resp = new Response(403);
            res.json(resp);
        } else {
            res.json({
                text: 'protected route',
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
        const resp = new Response(403);
        res.json(resp);
    }
}


var testAppointment = {
    appointment_id: 50,
    patient_id: 20,
    staff_id: 30,
    staff_name: 'josh hazlewood',
    start_time: new Date(2018, 2, 21, 16),
    end_time: new Date(2018, 2, 21, 16, 30)
}

// console.log(testAppointment);
// appointmentsModel.create(testAppointment, function(err) {
//     // if (err) return handleError(err)
//     if (err) {
//         console.log('Error Inserting New Appointment Data');
//         if (err.name == 'ValidationError') {
//             for (field in err.errors) {
//                 console.log(err.errors[field].message);
//             }
//         }
//     } else {
//         console.log('added to appointments')
//     }
// });

module.exports = router;