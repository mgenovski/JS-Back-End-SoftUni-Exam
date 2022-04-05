const authController = require('../controllers/auth.js');
const homeController = require('../controllers/home.js');
const postController = require('../controllers/post.js')

module.exports = (app) => {
    app.use(authController);
    app.use(homeController);
    app.use(postController);
}