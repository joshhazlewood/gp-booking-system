var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const appointment_idRequiredErrorMsg = 'Appointment ID is required.';
const patient_idRequiredErrorMsg = 'Patient ID is required.';
const staff_idRequiredErrorMsg = 'Staff ID is required.';
const start_timeRequiredErrorMsg = 'Appointment start time is required';
const end_timeRequiredErrorMsg = 'Appointment end time is required';

var appointmentsSchema = new Schema({
    appointment_id: {
        type: Number,
        min: 1,
        max: 1000,
        required: [true, appointment_idRequiredErrorMsg]
    },
    patient_id: {
        type: Number,
        min: 1,
        max: 1000,
        required: [true, patient_idRequiredErrorMsg]
    },
    staff_id: {
        type: Number,
        min: 1,
        max: 1000,
        required: [true, staff_idRequiredErrorMsg]
    },
    start_time: {
        type: Date,
        required: [true, start_timeRequiredErrorMsg]
    },
    end_time: {
        type: Date,
        required: [true, end_timeRequiredErrorMsg]
    }
});

module.exports = appointmentsSchema;