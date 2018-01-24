var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appointmentsSchema = new Schema({
    appointment_id: {
        type: Number,
        min: 1,
        max: 1000,
        required: [true, 'Appointment ID is required.']
    },
    patient_id: {
        type: Number,
        min: 1,
        max: 1000,
        required: [true, 'Patient ID is required.']
    },
    staff_id: {
        type: Number,
        min: 1,
        max: 1000,
        required: [true, 'Staff ID is required.']
    },
    start_time: {
        type: Date,
        required: [true, 'Appointment start time is required']
    },
    end_time: {
        type: Date,
        required: [true, 'Appointment end time is required']
    }
});

module.exports = appointmentsSchema;