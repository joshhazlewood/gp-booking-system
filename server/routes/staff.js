const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const staffSchema = require('../schemas/staff');

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

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

router.get('/', function(req, res) {
    staffModel.find({}, function(err, staff) {
        if (!err) {
            response.data = staff;
            res.json(response);
        } else {
            console.log(err);
        }
    });
})

router.get('/:id', function(req, res) {
    staffModel.find({'staff_id' : req.params.id}, function(err, staff) {
        if (!err) {
            console.log(staff.length);
            // find returns an array - check if empty then send to 404
            if(staff.length === 0) {
                response.status = 404;
                response.data = null;
                res.json(response);
            } else { // continue with response if it's found
                response.status = 200;
                response.data = staff;
                res.json(response);
            }
        } else {
            console.log(err);
        }
    })
})

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
