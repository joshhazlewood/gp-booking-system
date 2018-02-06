const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const patientSchema = require('../schemas/patient');

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

var patientModel = mongoose.model('patients', patientSchema, 'patients');
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

router.get('/', function (req, res) {
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
router.get('/:id', function (req, res) {
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
        console.log('added to patients collection')
//     }
// })

module.exports = router;
