const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
var multer = require("multer");

const config = require("../config/database");

var User = require("../model/users");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
})

var upload = multer({ storage: storage });

router.post('/register', upload.single('avatar'), (req, res, next) => {
    avpath = req.file.path;
    avlength = avpath.length;
    av = avpath.slice(6, avlength);
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatarPath: av,
        avatarName: req.file.originalname
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: "Failed to register user" });
        } else {
            res.json({ success: true, msg: "User registered" });
        }
    });


});




router.post('/authenticate', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    User.getUserByName(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: "User Not Found" });
        }



        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 86400
                });

                res.json({
                    success: true,
                    token: "JWT " + token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        name: user.name
                    }
                });
            } else {
                res.json({ success: false, msg: "Password not matched" });
            }
        })



    });

    router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
        res.json({ user: req.user });
    })

});

module.exports = router;