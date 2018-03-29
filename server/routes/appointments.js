const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const moment = require('moment');

var appointmentsSchema = require('../schemas/appointments');
var appointmentsModel = mongoose.model('appointments', appointmentsSchema, 'appointments');

var PatientSchema = require('../schemas/patient');
var Patient = mongoose.model('Patient', PatientSchema, 'patients');

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

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
            response.data = appointments;
            res.json(response);
        } else {
            console.log(err);
        }
    });
});


router.post('/new-appointment', ensureToken, function (req, res) {
    resetResponse();
    const appTaken = false;
    const { doctor, date, patient_id } = req['body'];
    const doc_id = doctor['_id'];
    const start_time = moment(date);
    const end_time = moment(date).add(30, 'm');
    const appointment = {
        patient: patient_id,
        staff: doc_id,
        start_time: date,
        end_time
    };

    appointmentsModel.findOne({
        'start_time': date,
        'staff': doc_id
    },
        function (err, app) {
            if (err) {
                console.log(err);
                response.status = 500;
                res.json(response);
            } else {
                if (app === null) {
                    appointmentsModel.create(appointment, function (err) {
                        if (err) {
                            console.log('Error saving appointment data');
                            response.status = 500;
                            res.json(response);
                        } else {
                            console.log('Saved appointment to DB');
                            response.status = 200;
                            res.json(response);
                        }
                    });
                } else {
                    console.log('Appointment already taken!');
                    response.status = 409;
                    res.json(response);
                }
            }
        });

});

router.get('/id/:id', function (req, res) {
    appointmentsModel.find({ 'appointment_id': req.params.id }, function (err, appointment) {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (appointment.length === 0) {
                response.status = 404;
                response.data = null;
                res.json(response);
            } else {
                // continue with response if it's found
                response.status = 200;
                response.data = appointment;
                res.json(response);
            }
        } else {
            console.log(err);
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
                response.status = 404;
                response.data = null;
                res.json(response);
            } else {
                // continue with response if it's found
                response.status = 200;
                response.data = appointments;
                res.json(response);
            }
        } else {
            console.log(err);
        }
    });
});

router.get('/app-as-event/:doctor_id', ensureToken, (req, res) => {
    resetResponse();
    const doc_id = req.params.doctor_id;

    appointmentsModel.find({ 'staff': doc_id }).
    populate('patient', '_id forename surname').
    populate('staff', '_id forename surname').
    exec(function(err, appointments) {
        if (err) return handleError(err);
        else {
            // continue with response if it's found
            response.status = 200;
            response.data = appointments;
            res.json(response);
        }
    });
});

function handleError(err) {
    console.log(err);
}

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