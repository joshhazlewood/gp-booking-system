const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

var appointmentsSchema = require('../schemas/appointments');
var appointmentsModel = mongoose.model('appointments', appointmentsSchema, 'appointments');

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

router.get('/', function (req, res) {
    appointmentsModel.find({}, function (err, appointments) {
        if (!err) {
            response.data = appointments;
            res.json(response);
        } else {
            console.log(err);
        }
    });
})

router.get('/id/:id', function (req, res) {
    appointmentsModel.find({ 'appointment_id': req.params.id }, function (err, appointment) {
        if (!err) {
            console.log(appointment.length);
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
    })
})

router.get('/date/:date', function(req, res) {
    date = req.params.date;
    dateToFind = new moment(date);
    dateToFindPlusOneDay = new moment(date);
    dateToFindPlusOneDay = dateToFindPlusOneDay.add(1, 'd');

    appointmentsModel.find({'start_time': { '$gte' : dateToFind.toDate(), '$lt': dateToFindPlusOneDay.toDate() }}, function (err, appointments ) {
        console.log('stuff');
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
})

// var testAppointment = {
//     appointment_id: 50,
//     patient_id : 20,
//     staff_id: 30,
//     staff_name: 'doc2',
//     start_time: new Date(2018, 1, 16, 9),
//     end_time: new Date(2018, 1, 16, 9, 30)
// }

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