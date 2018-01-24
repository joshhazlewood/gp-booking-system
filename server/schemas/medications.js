const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nameRequiredErrorMsg = 'Medication name is required.';
const amountRequiredErrorMsg = 'Medication amount is required.';
const unitRequiredErrorMsg = 'Medication unit is required.';

const medicationsSchema = new Schema({
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
});

module.exports = medicationsSchema;