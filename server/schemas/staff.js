var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var staffSchema = new Schema({
    forename: String,
    surname: String,
    staff_role: Number,
    user_name: String,
    password: String
});

module.exports = staffSchema;