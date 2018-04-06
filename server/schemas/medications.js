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
        default: ''
    },
    amount: {
        type: String,
        min: 1,
        max: 100,
        default: ''
    },
    unit: {
        type: String,
        min: 1,
        max: 50,
        default: ''
    }
});

module.exports = medicationsSchema;