const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const Response = require('../response');
const staffSchema = require('../schemas/staff');
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, simple } = format;

const options = {
    db: mongoose.db,
    collection: 'logs'
};

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
        format.splat(),
        format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'info.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'warning.log',
            level: 'warn'
        })
    ]
});


// STAFF COLLECTION
var staffModel = mongoose.model('staff', staffSchema, 'staff');

var testStaff = {
    // staff_id: 50,
    forename: 'test',
    surname: 'admin',
    staff_role: 'admin',
    user_name: 'admin@test.com',
    password: 'test'
};

router.get('/', function (req, res) {
    staffModel.find({}, function (err, staff) {
        if (!err) {
            const resp = new Response(200, staff);
            res.json(resp);
        } else {
            console.log(err);
            const resp = new Response(404);
            res.json(resp);
        }
    });
});

router.get('/id/:id', function (req, res) {
    staffModel.find({ 'staff_id': req.params.id }, function (err, staff) {
        if (!err) {
            console.log(staff.length);
            // find returns an array - check if empty then send to 404
            if (staff.length === 0) {
                const resp = new Response(404);
                res.json(resp);
            } else { // continue with response if it's found
                const resp = new Response(200, staff);
                res.json(resp);
            }
        } else {
            console.log(err);
            const resp = new Response(500);
            res.json(resp);
        }
    })
});

router.get('/doctors', function (req, res) {
    staffModel.find({ 'staff_role': 'doctor' }, '_id staff_id forename surname', function (err, staff) {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (staff.length === 0) {
                const resp = new Response(404);
                res.json(resp);
            } else { // continue with response if it's found
                const resp = new Response(200, staff);
                res.json(resp);
            }
        } else {
            handleError(err);
            const resp = new Response(500, staff);
            res.json(resp);
        }
    })
});

router.get('/all-staff', function (req, res) {
    staffModel.find({}, '_id staff_id forename surname', function (err, staff) {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (staff.length === 0) {
                const resp = new Response(404);
                res.json(resp);
            } else { // continue with response if it's found
                const resp = new Response(200, staff);
                res.json(resp);
            }
        } else {
            handleError(err);
            const resp = new Response(500, staff);
            res.json(resp);
        }
    })
});

router.post('/login', (req, res) => {
    const user = req.body;
    const username = user.username
    const password = user.password

    staffModel.findOne({ 'user_name': username }, (err, staffMember) => {
        if (!err) {
            // find returns an array - check if empty then send to 404
            if (staffMember === null) {
                const resp = new Response(404);
                res.json(resp);
            } else { // continue with response if it's found
                const hash = staffMember.password;
                const passwordMatches = bcrypt.compareSync(password, hash);
                if (passwordMatches) {
                    // Expires in 9 hours for staff
                    const expiresIn = (60 * 60 * 9);
                    let tokenData = JSON.stringify({
                        user_id: staffMember._id,
                        // user_name: username,
                        // pretty_id: staffMember.staff_id,
                        user_role: staffMember.staff_role
                    });

                    const token = jwt.sign({
                        data: tokenData
                    }, '13118866', {
                            expiresIn
                        });

                    const data = {
                        id_token: token,
                        expires_in: expiresIn
                    }

                    logger.log('info', 'User %s logged in.', username);

                    const resp = new Response(200, data);
                    res.json(resp);
                } else {
                    logger.log('warn', 'User %s attemped to log in.', username);
                    const resp = new Response(401);
                    res.json(resp);
                }
            }
        } else {
            console.log(err);
            const resp = new Response(404);
            res.json(resp);
        }
    })
        .catch(err => {
            console.log(err);
        })
});

router.get('/staffMember/:id', ensureToken, (req, res) => {
    const id = req.params.id;
    const idIsValid = mongoose.Types.ObjectId.isValid(id);

    if (idIsValid) {
        console.log('valid');
        staffModel.findById({ _id: id }, '-password -staff_id', function (err, staff) {
            if (err) {
                handleError(err);
                const resp = new Response(404);
                res.json(resp);
            } else {
                const resp = new Response(200, staff);
                res.json(resp);
            }
        });
    }

});

router.patch('/staffMember/:id', ensureToken, (req, res) => {

    const { _id, forename, surname, username, user_role } = req.body;

    staffModel.findByIdAndUpdate({ _id: req.params.id },
        {
            $set: {
                forename: forename,
                surname: surname,
                user_name: username,
                user_role: user_role
            }
        },
        { new: true }, function (err, staff) {
            if (err) {
                const resp = new Response(404);
                res.json(resp);
            }
            const resp = new Response(200);
            res.json(resp);
        }
    );
});

router.get('/user-data/:id', ensureToken, function (req, res) {

    const id = req.params.id;
    let idIsValid = mongoose.Types.ObjectId.isValid(id);
    if (idIsValid) {
        staffModel.findById({ _id: req.params.id }, '_id staff_id staff_role user_name', function (err, staffMember) {
            if (err) {
                handleError(err);
                const resp = new Response(404);
                res.json(resp);
            } else {
                const resp = new Response(200, staffMember);
                res.json(resp);
            }
        })
            .catch(err => {
                handleError(err);
            });
    } else {
        const message = "Incorrect format for user_id";
        const resp = new Response(422, null, message);
        res.json(resp);
    }
});

router.post('/new-staff', (req, res) => {

    const { forename, surname, username, staff_role, password } = req.body;

    const saltRounds = 10;
    var hash = bcrypt.hashSync(password, saltRounds);

    var newStaff = new staffModel({
        // patient_id: 100,
        forename: forename,
        surname: surname,
        user_name: username,
        staff_role: staff_role,
        password: hash
    });

    newStaff.save(function (err, resp) {
        if (err) {
            console.log(err);
            const resp = new Response(404);
            res.json(resp);
        } else {
            const resp = new Response(200);
            res.json(resp);
        }
    });
});

function handleError(err) {
    console.log(err);
}

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, '13118866', (err, data) => {
            if (err) {
                res.sendStatus(401);
            } else {
                console.log('verified token');
                next();
            }
        })
        // next();
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
