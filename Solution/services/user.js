const User = require('../models/User.js');
const { hash, compare } = require('bcrypt');

async function register(email, password, skills) {
    const existing = await getUserByUsername(email);
    if(existing) {
        throw new Error('Username is taken');
    }

    const hashedPassword = await hash(password, 10);

    const user = new User({
        email,
        skills,
        hashedPassword
    });
    await user.save();

    return user;
}

async function login(email, password) {
    const user = await getUserByUsername(email);

    if(!user) {
        throw new Error('Incorrect username or password');
    }

    const hasMatch = await compare(password, user.hashedPassword);

    if(!hasMatch) {
        throw new Error('Incorrect username or password');
    }

    return user;
}

async function getUserByUsername(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

    return user;
}

module.exports = {
    login,
    register
}