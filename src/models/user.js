const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// Define schema for app
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Cannot include password in password')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Virtual property. Relationship between two entities but only virually. Not on the model
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// Instance methods - Available on the instance of the model
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET) 
    
    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token 
}

// Remove unecessary JSON data from any API response
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// Setup a function we can use on the model (Model methods)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user) {
        throw new Error('Unable to log in')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user

}

// Middleware setup to hash plain text password password before saving. 
// Has to be a classic function as we need access to 'this' which arrow doesn't allow.
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    console.log('Just before saving!')

    next()
})

// Delete user task when user is removed.
userSchema.pre('remove', async function(next) {
    const user = this

    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User