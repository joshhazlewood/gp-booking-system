var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = require('../schemas/address');
var clinicalNotesSchema = require('../schemas/clinical_notes');

var patientSchema = new Schema({
    patient_id: Number,
    forename: String,
    surname: String,
    address: [addressSchema],
    clinical_notes: [clinicalNotesSchema],
    user_name: String,
    password: String
});

module.exports = patientSchema;