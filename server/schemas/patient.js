var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = require('../schemas/address');
var clinicalNotesSchema = require('../schemas/clinical_notes');

const patient_idRequiredErrorMsg = 'Patient ID is required';
const fornameRequiredErrorMsg = 'Forname is required';
const surnameRequiredErrorMsg = 'Surname is required';
const user_nameRequiredErrorMsg = 'Username is required';
const passwordRequiredErrorMsg = 'Password is required';

var patientSchema = new Schema({
    patient_id: {
        type: Number,
        min: 1,
        max: 1000,
        required: [true, patient_idRequiredErrorMsg]
    },
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
    address: [addressSchema],
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

module.exports = patientSchema;