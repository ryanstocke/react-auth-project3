const express = require('express')
const router = express.Router()
const User = require("../models/user");
const passport = require('../config/')

router.post('/', (req, res) => {
    console.log('user signup');
    console.log(req.body)
    const { username, password } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                password: password
            })
            newUser.password = newUser.hashPassword(password);
            console.log(newUser);
            newUser.save((err) => {
                if (err) return res.json(err)
                console.log(newUser)
                res.json(newUser)
            })
        }
    })
})

router.post(
    '/login',
    function (req, res, next) {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);
    }
)

router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
});
// router.get("/game",isAuthenticated, function(req, res) {
//     res.sendFile(path.join(__dirname, "../client/public/game.html"));
//   });
// router.post("/testing", (req, res)=> {
//     console.log(req.body)
//     res.send(req.body)
// })

module.exports = router