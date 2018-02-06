const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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

router.get('/:id', function (req, res) {
    appointmentsModel.find({ 'appointment_id': req.params.id }, function (err, appointment) {
        if (!err) {
            console.log(appointment.length);
            // find returns an array - check if empty then send to 404
            if (appointment.length === 0) {
                response.status = 404;
                response.data = null;
                res.json(response);
            } else { // continue with response if it's found
                response.status = 200;
                response.data = appointment;
                res.json(response);
            }
        } else {
            console.log(err);
        }
    })
})

// var testAppointment = {
//     appointment_id: 50,
//     patient_id : 20,
//     staff_id: 30,
//     start_time: new Date(),
//     end_time: new Date()
// }

// console.log(testAppointment);
// appointmentModel.create(testAppointment, function(err) {
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