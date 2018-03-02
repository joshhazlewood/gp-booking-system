var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicationsSchema = require('../schemas/medications');

const diagnosisRequiredErrorMsg = 'Diagnosis is required.';
const NotesRequiredErrorMsg = 'Diagnosis is required.';
const nameRequiredErrorMsg = 'Medication name is required.';
const amountRequiredErrorMsg = 'Medication amount is required.';
const unitRequiredErrorMsg = 'Medication unit is required.';

var clinicalNotesSchema = new Schema({
    diagnosis: {
        type: String,
        min: 1,
        max: 250,
        required: [true, diagnosisRequiredErrorMsg]
    },
    notes: {
        type: String,
        min: 1,
        max: 1000
    },
    last_accessed: Date,
    last_accessed_by: Number,
    medications: [
        {
            name: {
                type: String,
                min: 1,
                max: 100,
                required: [true, nameRequiredErrorMsg]
            },
            amount: {
                type: Number,
                min: 1,
                max: 6,
                required: [true, amountRequiredErrorMsg]
            },
            unit: {
                type: String,
                min: 1,
                max: 50,
                required: [true, unitRequiredErrorMsg]
            }
        }]
});

module.exports = clinicalNotesSchema;