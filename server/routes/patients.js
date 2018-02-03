const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const patientSchema = require('../schemas/patient');

const patientModel = mongoose.model('patients', patientSchema, 'patients');
const testPatient = {
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
