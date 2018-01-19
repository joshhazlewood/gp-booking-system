var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicationsSchema = require('../schemas/medications');

var clinicalNotesSchema = new Schema({
    diagnosis: String,
    notes: String,
    last_accessed: Date,
    last_accessed_by: Number,
    medications: [medicationsSchema]
});

module.exports = clinicalNotesSchema;