const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const appointmentsSchema = require('../schemas/appointments');

router.get('/', function(req, res) {
    res.send('appointments');
})

const appointmentModel = mongoose.model('appointments', appointmentsSchema, 'appointments');
const testAppointment = {
    appointment_id: 50,
    patient_id : 20,
    staff_id: 30,
    start_time: new Date(),
    end_time: new Date()
}

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