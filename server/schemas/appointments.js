var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appointmentsSchema = new Schema({
    appointment_id: Number,
    patient_id: Number,
    staff_id: Number,
    start_time: Date,
    end_time: Date
});

module.exports = appointmentsSchema;