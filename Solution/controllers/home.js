const { getPosts, getPostById, searchPosts, getFirstPosts } = require('../services/post.js');
const { postViewModel } = require('../util/mappers.js');

const router = require('express').Router();

router.get('/', async (req, res) => {
    const posts = (await getFirstPosts()).map(postViewModel);
    res.render('home', { title: 'Home Page', posts });
});

router.get('/catalog', async (req, res) => {
    const posts = (await getPosts()).map(postViewModel);
    res.render('catalog', { title: 'Catalog Page', posts });
})

router.get('/catalog/:id', async (req, res) => {
    const id = req.params.id;
    const post = postViewModel(await getPostById(id));

    if (req.session.user) {
        post.hasUser = true;
        if (req.session.user._id == post.author._id) {
            post.isAuthor = true;
        } else {
            post.hasApplied = post.users.find(v=> v._id == req.session.user._id) != undefined;
        }

        post.numOfPeople = post.users.length;
    }

    res.render('details', { title: post.title, post });
});

router.get('/search', async (req, res) => {
    const hasSearched = false;
    res.render('search', { title: 'Search Page', hasSearched });
})

router.post('/search', async (req, res) => {
    const result = await searchPosts(req.body.search);
    let posts = undefined;
    if(result) {
        posts = result.map(postViewModel);
    }
    const hasSearched = true;
    res.render('search', { title: 'Search Page', posts, hasSearched });
})

module.exports = router;