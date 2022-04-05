const { Schema, model, Types: { ObjectId } } = require('mongoose');


const EMAIL_PATTERN = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/;

const userSchema = new Schema({
    email: { type: String, required: [true, 'Email is required'], validate: {
        validator(value) {
            return EMAIL_PATTERN.test(value);
        },
        message: 'Email must be valid and may contain only English letters.'
    } },
    skills: { type: String, required: true, maxlength: [40, 'Description of skills must be less 41 chars long']},
    myAds: { type: [ObjectId], ref: 'Ad', default: [] },
    hashedPassword: { type: String, required: true }
});

userSchema.index({ email: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
})

const User = model('User', userSchema);

module.exports = User;