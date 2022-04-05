function mapErrors(err) {
    if (Array.isArray(err)) {
        return err;
    } else if (err.name == 'ValidationError') {
        return Object.values(err.errors).map(e => ({ msg: e.message }));
    } else if (typeof err.message == 'string') {
        return [{ msg: err.message }];
    } else {
        return [{ msg: 'Request error'}];
    }
}

function postViewModel(post) {
    return {
        _id: post._id,
        headline: post.headline,
        location: post.location,
        companyName: post.companyName,
        description: post.description,
        author: authorViewModel(post.author),
        users: post.users.map(userViewModel)
    };
}

function authorViewModel(user) {
    return {
        _id: user._id,
        email: user.email
    };
}

function userViewModel(user) {
    return {
        _id: user._id,
        email: user.email,
        skills: user.skills
    };
}

module.exports = {
    mapErrors,
    postViewModel
};