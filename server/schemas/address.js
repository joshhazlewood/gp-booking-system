var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
    line1: String,
    line2: String,
    town_city: String,
    postcode: String
});

module.exports = addressSchema;