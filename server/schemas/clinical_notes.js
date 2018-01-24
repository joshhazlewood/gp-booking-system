var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicationsSchema = require('../schemas/medications');

const diagnosisRequiredErrorMsg = 'Diagnosis is required.';
const NotesRequiredErrorMsg = 'Diagnosis is required.';

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
    medications: [medicationsSchema]
});

module.exports = clinicalNotesSchema;