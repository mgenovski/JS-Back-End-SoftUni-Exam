const { isGuest, isUser } = require('../middleware/guards.js');
const { register, login } = require('../services/user.js');
const { mapErrors } = require('../util/mappers.js');

const router = require('express').Router();

router.get('/register', isGuest(), (req, res) => {
    res.render('register', { title: 'Register Page' });
});

// TODO Check form action, method, field names
router.post('/register', isGuest(), async (req, res) => {
    try {
        if (req.body.password.trim() == '') {
            throw new Error('Passwords is required');
        } else if (req.body.password != req.body.repass) {
            throw new Error('Passwords do not match');
        } else if(req.body.password.length < 5) {
            throw new Error('Passwords must be at least 5 characters long');
        }

        const user = await register(req.body.email, req.body.password, req.body.skills);
        req.session.user = user;
        res.redirect('/'); // TODO check required redirect
    } catch (err) {
        console.log(err);
        // TODO send error messages
        const errors = mapErrors(err);
        const data = {
            email: req.body.email,
            skills: req.body.skills
        }
        res.render('register', { title: 'Register Page', data, errors });
    }
})

router.get('/login', isGuest(), (req, res) => {
    res.render('login', { title: 'Login Page' });
});

// TODO Check form action, method, field names
router.post('/login', isGuest(), async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);
        req.session.user = user;
        res.redirect('/'); // TODO check required redirect
    } catch (err) {
        console.log(err);
        const errors = mapErrors(err);
        res.render('login', { title: 'Login Page', data: { email: req.body.email }, errors });
    }
});

router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
})

module.exports = router;