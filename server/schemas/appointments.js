var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appointmentsSchema = new Schema({
    appointment_id: {
        type: Number,
        min: 1,
        max: 1000,
        required: [true, 'ID is required']
    },
    patient_id: Number,
    staff_id: Number,
    start_time: Date,
    end_time: Date
});

module.exports = appointmentsSchema;