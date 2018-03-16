const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const staffSchema = require('../schemas/staff');

// STAFF COLLECTION
var staffModel = mongoose.model('staff', staffSchema, 'staff');

var testStaff = {
    staff_id: 50,
    forename: 'josh',
    surname: 'hazlewood',
    staff_role: 'doctor',
    user_name: 'joshhaz',
    password: 'test'
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

router.get('/', function (req, res) {
    staffModel.find({}, function (err, staff) {
        if (!err) {
            response.data = staff;
            res.json(response);
        } else {
            console.log(err);
        }
    });
});

router.get('/id/:id', function (req, res) {
    staffModel.find({ 'staff_id': req.params.id }, function (err, staff) {
        if (!err) {
            console.log(staff.length);
            // find returns an array - check if empty then send to 404
            if (staff.length === 0) {
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
            response.status = 500;
            response.data = null
            res.json(response);
        }
    })
});

router.get('/doctors', function (req, res) {
    staffModel.find({ 'staff_role': 'doctor' }, 'forename surname staff_id', function (err, staff) {
        if (!err) {
            // console.log(staff.length);
            // find returns an array - check if empty then send to 404
            if (staff.length === 0) {
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

router.post('/login', (req, res) => {
    resetResponse();
    const user = req.body;
    const username = user.username
    const password = user.password

    staffModel.findOne({ 'user_name': username }, (err, staffMember) => {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (staffMember === null) {
                response.status = 404;
                response.data = null;
                res.json(response);
            } else { // continue with response if it's found
                if (password === staffMember.password) {
                    // Expires in 9 hours for staff
                    const expiresIn = (60 * 60 * 9);
                    let tokenData = JSON.stringify({
                        user_id: staffMember._id,
                        // user_name: username,
                        // pretty_id: staffMember.staff_id,
                        // user_role: staffMember.staff_role
                    });

                    const token = jwt.sign({
                        data: tokenData
                    }, '13118866', {
                            expiresIn
                        });

                    response.status = 200;
                    response.data = {
                        id_token: token,
                        expires_in: expiresIn
                    }
                    res.json(response);
                } else {
                    response.status = 401;
                    res.json(response);
                }
            }
        } else {
            console.log(err);
        }
    })
        .catch(err => {
            console.log(err);
        })
});

router.get('/user-data/:id', ensureToken, function (req, res) {
    resetResponse();
    const id = req.params.id;
    let idIsValid = mongoose.Types.ObjectId.isValid(id)
    if (idIsValid) {
        staffModel.findById({ _id: req.params.id }, '_id staff_id staff_role user_name', function (err, staffMember) {
            if (err) {
                handleError(err);
                response.status = 404;
                response.data = null;
                res.json(response);
            } else {
                response.status = 200;
                response.data = staffMember;
                res.json(response);
            }
        })
            .catch(err => {
                handleError(err);
            });
    } else {
        response.status = 422;
        response.data = null;
        response.message = "Incorrect format for user_id";
        res.json(response);
    }
});

function handleError(err) {
    console.log(err);
}
function resetResponse() {
    response.status = 200;
    response.data = [];
    response.message = null;
}

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

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
// });

module.exports = router;
