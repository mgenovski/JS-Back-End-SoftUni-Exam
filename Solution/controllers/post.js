const { isUser } = require('../middleware/guards.js');
const { createPost, getPostById, updatePost, deletePost, apply } = require('../services/post.js');
const { mapErrors, postViewModel } = require('../util/mappers.js');

const router = require('express').Router();

router.get('/create', isUser(), async (req, res) => {
    res.render('create', { title: 'Create Page' });
});

router.post('/create', isUser(), async (req, res) => {
    const userId = req.session.user._id;
    const post = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        description: req.body.description,
        author: userId
    }

    try {
        await createPost(post);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Page', errors, data: post });
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const post = postViewModel(await getPostById(id));

    if (req.session.user._id != post.author._id) {
        return res.redirect('/');
    }

    res.render('edit', { title: 'Edit Page', post });

});

router.post('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;

    const existing = postViewModel(await getPostById(id));

    if (req.session.user._id != existing.author._id) {
        return res.redirect('/');
    }

    const post = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        description: req.body.description
    }

    try {
        await updatePost(id, post);
        res.redirect(`/catalog/${id}`);
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        post._id = id;
        res.render('edit', { title: 'Edit Page', post, errors });
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id;

    const existing = postViewModel(await getPostById(id));

    if (req.session.user._id != existing.author._id) {
        return res.redirect('/');
    }

    try {
        await deletePost(id);
        res.redirect('/catalog');
    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('details', { title: existing.title, errors });
    }
});

router.get('/apply/:id', isUser(), async (req, res) => {
    const id = req.params.id;

    try {
        await apply(id, req.session.user._id);
        res.redirect('/catalog/' + id);
    } catch(err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('details', { title: 'Post Details', errors });
    }
});

router.get('*', function(req, res){
    res.render('404', { title: 'Page not found'});
  });

module.exports = router;