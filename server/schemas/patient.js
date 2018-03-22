var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var addressSchema = require('../schemas/address');
var clinicalNotesSchema = require('../schemas/clinical_notes');


const patient_idRequiredErrorMsg = 'Patient ID is required';
const fornameRequiredErrorMsg = 'Forname is required';
const surnameRequiredErrorMsg = 'Surname is required';
const addressRequiredErrorMsg = 'Address is required';
const user_nameRequiredErrorMsg = 'Username is required';
const passwordRequiredErrorMsg = 'Password is required';

var patientSchema = new Schema({
    // patient_id: {
    //     type: Number,
    //     min: 1,
    //     max: 1000,
    //     required: [true, patient_idRequiredErrorMsg]
    // },
    forename: {
        type: String,
        min: 1,
        max: 50,
        required: [true, fornameRequiredErrorMsg]
    },
    surname: {
        type: String,
        min: 1,
        max: 100,
        required: [true, surnameRequiredErrorMsg]
    },
    address: addressSchema,
    clinical_notes: [clinicalNotesSchema],
    user_name: {
        type: String,
        min: 1,
        max: 100,
        required: [true, user_nameRequiredErrorMsg]
    },
    password: {
        type: String,
        min: 1,
        max: 100,
        required: [true, passwordRequiredErrorMsg]
    }
});

autoIncrement.initialize(mongoose.connection);

// patientSchema.resetCount();
patientSchema.plugin(autoIncrement.plugin, {
    model: 'patient',
    field: 'patient_id',
    startAt: 1,
    incrementBy: 1
});

// RESETING COUNT
// var Patient = mongoose.model('Patient', patientSchema);
// var patient1 = new Patient({
//     forename: 'test',
//     surname: 'hazlewood',
//     address: [{
//         line1: '2b',
//         line2: 'davenport ave',
//         town_city: 'manchester',
//         postcode: 'M20 3EY'
//     }],
//     clinical_notes: [{
//         diagnosis: 'he\'s a sick cunt',
//         notes: 'loads of notes here',
//         last_accessed: new Date(),
//         last_accessed_by: 10,
//         medications: [{
//             name: 'lisinopril',
//             amount: '5',
//             unit: 'mg/day'
//         }, {
//             name: 'test_med',
//             amount: '5',
//             unit: 'mg/day'
//         }]
//     }],
//     user_name: 'joshhaz@gmail.com',
//     password: 'testPass'
// });

// patient1.save((err) => {
//     patient1.nextCount(function (err, count) {

//         // count === 101 -> true 

//         patient1.resetCount(function (err, nextCount) {
//             console.log('reset');
//             // nextCount === 100 -> true 

//         });

//     });
// }

// );


module.exports = patientSchema;