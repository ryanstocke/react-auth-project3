const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs');
mongoose.promise = Promise

// Define userSchema
const userSchema = new Schema({

	username: {
		type: String,
		unique: false,
		required: [true, "username is required"]
	},
	password: {
		type: String,
		unique: false,
		validate: {
			validator: function (v) {
				return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v);
			},
			message: props => `${props.value} is not a valid password`
		},
		required: [true, "password is required"]
	},
	admin: {
		type: Boolean,
		unique: false,
		required: true,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}

})

// Define schema methods
userSchema.methods = {
	checkPassword: function (inputPassword) {
		return bcrypt.compareSync(inputPassword, this.password)
	},
	hashPassword: plainTextPassword => {
		console.log(plainTextPassword)
		return bcrypt.hashSync(plainTextPassword, bcrypt.genSaltSync(10))
	}
}


const User = mongoose.model('User', userSchema)
module.exports = User
