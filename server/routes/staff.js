const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const staffSchema = require('../schemas/staff');

// STAFF COLLECTION
const staffModel = mongoose.model('staff', staffSchema, 'staff');
const testStaff = {
    staff_id: 50,
    forename : 'josh',
    surname : 'hazlewood',
    staff_role: 10,
    user_name : 'joshhaz',
    password : 'test'
};

// staffModel.create(testStaff, function(err) {
//     if (err) {
//         console.log('Error Inserting New Staff Data');
//         if (err.name == 'ValidationError') {
//             for (field in err.errors) {
//                 console.log(err.errors[field].message);
//             }
//         }
//     } else {
//         console.log('added to staff collection')
//     }
// })

module.exports = router;
