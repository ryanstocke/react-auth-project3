const express = require('express')
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes');
const session = require('express-session');
const dbConnection = require('./config');
// const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const morgan = require('morgan');

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
// Sessions
app.use(
	session({
		secret: 'lord of bones', //pick a random string to make the hash that is generated secure
        // store: new MongoStore({ mongooseConnection: dbConnection }),
        resave: false, //required
		saveUninitialized: false //required
	})
)

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use(routes);
// Starting Server 

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/react-auth-project3', { useNewUrlParser: true }, function(err) {
    if (err) throw err;
    console.log(`mongoose connection successful`);
    app.listen(PORT, (err)=> {
        if (err) throw err;
        console.log(`connected on port ${PORT}`)
    });
});
