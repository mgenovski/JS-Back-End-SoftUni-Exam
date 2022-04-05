const { Schema, model, Types: { ObjectId } } = require('mongoose');

const postSchema = new Schema({
    headline: { type: String, minlength: [4, 'Headline must be at least 4 chars long'] },
    location: { type: String, minlength: [8, 'Location must be at least 8 chars long'] },
    companyName: { type: String, minlength: [3, 'Company Name must be at least 3 chars long'] },
    description: { type: String, required: true, maxlength: [40, 'Description must be at most 40 chars long'] },
    author: { type: ObjectId, ref: 'User', required: true },
    users: { type: [ObjectId], ref: 'User', default: [] },
});

const Post = model('Post', postSchema);

module.exports = Post;