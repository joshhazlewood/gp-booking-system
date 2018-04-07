const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const staff_idRequiredErrorMsg = 'Staff ID is required';
const fornameRequiredErrorMsg = 'Forname is required';
const surnameRequiredErrorMsg = 'Surname is required';
const staff_roleRequiredErrorMsg = 'Staff_role is required';
const user_nameRequiredErrorMsg = 'Username is required';
const passwordRequiredErrorMsg = 'Password is required';

var staffSchema = new Schema({
    // staff_id: {
    //     type: Number,
    //     min: 1,
    //     max: 1000,
    //     required: [true, staff_idRequiredErrorMsg]
    // },
    forename: {
        type: String,
        min: 1,
        max: 50,
        required: [true, fornameRequiredErrorMsg]
    },
    surname: {
        type: String,
        min: 1,
        max: 100,
        required: [true, surnameRequiredErrorMsg]
    },
    staff_role: {
        type: String,
        min: 1,
        max: 100,
        required: [true, staff_roleRequiredErrorMsg]
    },
    user_name: {
        type: String,
        min: 1,
        max: 100,
        unique: true,
        required: [true, user_nameRequiredErrorMsg]
    },
    password: {
        type: String,
        min: 1,
        max: 100,
        required: [true, passwordRequiredErrorMsg]
    }
});

autoIncrement.initialize(mongoose.connection);

staffSchema.plugin(autoIncrement.plugin, {
    model: 'staff',
    field: 'staff_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = staffSchema;