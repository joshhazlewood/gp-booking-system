var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicationsSchema = new Schema({
    name: String,
    amount: String,
    unit: String
});

module.exports = medicationsSchema;