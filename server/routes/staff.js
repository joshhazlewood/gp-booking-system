var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var staffSchema = require('../schemas/staff');

// STAFF COLLECTION
var staffModel = mongoose.model('staff', staffSchema, 'staff');
var testStaff = {
    staff_id: 50,
    forename : 'josh',
    surname : 'hazlewood',
    staff_role: 10,
    user_name : 'joshhaz',
    password : 'test'
};

staffModel.create(testStaff, function(err) {
    if (err) {
        console.log('Error Inserting New Staff Data');
        if (err.name == 'ValidationError') {
            for (field in err.errors) {
                console.log(err.errors[field].message);
            }
        }
    } else {
        console.log('added to staff collection')
    }
})

module.exports = router;
