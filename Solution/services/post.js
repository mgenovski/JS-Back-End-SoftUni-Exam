const Post = require('../models/Post.js');
const User = require('../models/User.js');

async function createPost(post) {
    const result = new Post(post);
    await result.save();

    return result;
}

async function getPosts() {
    return Post.find({});
}

async function getFirstPosts() {
    return Post.find({}).sort({ _id: 1 }).limit(3);
}

async function getPostsByAuthor(userId) {
    return Post.find({ author: userId }).populate('author', 'firstName lastName');
}

async function getPostById(id) {
    return Post.findById(id).populate('author', 'email').populate('users', 'email skills');
}

async function searchPosts(search) {
    const author = await User.findOne({ email: new RegExp(`^${search}$`, 'i') });
    if (author) {
        return Post.find({ author: author._id });
    }
}

async function updatePost(id, post) {
    const existing = await Post.findById(id);

    existing.headline = post.headline;
    existing.location = post.location;
    existing.companyName = post.companyName;
    existing.description = post.description;

    await existing.save();
}

async function deletePost(id) {
    return Post.findByIdAndDelete(id);
}

async function apply(postId, userId) {
    const post = await Post.findById(postId);
    const user = await User.findOne({ _id: userId });

    if (post.users.includes(userId)) {
        throw new Error('User has already applied');
    }

    post.users.push(userId);


    await post.save();
    await user.save();
}

module.exports = {
    createPost,
    getPosts,
    getFirstPosts,
    getPostsByAuthor,
    searchPosts,
    getPostById,
    updatePost,
    deletePost,
    apply
}