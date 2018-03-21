const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const appointment_idRequiredErrorMsg = 'Appointment ID is required.';
const patient_idRequiredErrorMsg = 'Patient ID is required.';
const staff_idRequiredErrorMsg = 'Staff ID is required.';
const start_timeRequiredErrorMsg = 'Appointment start time is required';
const end_timeRequiredErrorMsg = 'Appointment end time is required';
const staff_nameRequiredErrorMsg = 'Staff name is required';

var appointmentsSchema = new Schema({
    // appointment_id: {
    //     type: Number,
    //     min: 0,
    //     max: 100000,
    //     required: [true, appointment_idRequiredErrorMsg]
    // },
    patient_id: {
        type: String,
        min: 1,
        max: 1000,
        required: [true, patient_idRequiredErrorMsg]
    },
    staff_id: {
        type: String,
        min: 1,
        max: 1000,
        required: [true, staff_idRequiredErrorMsg]
    },
    // staff_name: {
    //     type: String,
    //     maxlength: 50,
    //     required: [true, staff_nameRequiredErrorMsg]
    // },
    start_time: {
        type: Date,
        required: [true, start_timeRequiredErrorMsg]
    },
    end_time: {
        type: Date,
        required: [false, end_timeRequiredErrorMsg]
    }
});

autoIncrement.initialize(mongoose.connection);

appointmentsSchema.plugin(autoIncrement.plugin, {
    model: 'appointment',
    field: 'appointment_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = appointmentsSchema;