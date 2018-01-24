const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const line1ValidationErrorMsg = 'Address Line 1 must be alphanumeric and whitespace characters, between 1-50 characters';
const line2ValidationErrorMsg = 'Address Line 2 must be alphanumeric and whitespace characters, between 1-50 characters';
const town_cityValidationErrorMsg = 'Town/City field must contain only letters and be between 1-50 characters';
const postcodeValidationErrorMsg = 'Postcode is not a valid UK postcode';

const line1RequiredErrorMsg = 'Address Line 1 is required.';
// const line2RequiredErrorMsg = 'Address Line 2 is required.';
const town_cityRequiredErrorMsg = 'Town/City is required.';
const postcodeRequiredErrorMsg = 'Postcode is required.';

const addressSchema = new Schema({
    line1: {
        type: String,
        required: [true, line1RequiredErrorMsg],
        validate: {
            validator: function(v) {
                return /^[\w\-\s]{1,50}$/.test(v); 
            },
            message: line1ValidationErrorMsg
        }
    },
    line2: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[\w\-\s]{1,50}$/.test(v); 
            },
            message: line2ValidationErrorMsg
        }
    },
    town_city: {
        type: String,
        required: [true, town_cityRequiredErrorMsg],
        validate: {
            validator: function(v) {
                return /^[A-z\-\'\s]{1,50}$/.test(v); 
            },
            message: town_cityValidationErrorMsg
        }
    },
    postcode: {
        type: String,
        required: [true, postcodeRequiredErrorMsg],
        validate: {
            validator: function(v) {
                return /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2}$)/.test(v); 
            },
            message: postcodeValidationErrorMsg
        }
    }
});

module.exports = addressSchema;