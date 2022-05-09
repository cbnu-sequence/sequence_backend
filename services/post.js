const {updateFilesByUrls, removeFilesByUrls, updateFilesByIds, removeFilesByIds} = require('../util/file')
const { POST_CATEGORY } = require('../constants')
exports.updateFilesOf = async (post, user) => {
    const ids = (post.files || []);
    console.log(post._id);
    await Promise.all([
        updateFilesByIds(user, post._id, 'Post', ids),
    ]);
}

exports.removeFilesOf = async (post, user) => {
    const ids = (post.files || []);
    await Promise.all([
        removeFilesByIds(user, ids),
    ])
}

exports.validateCategory1 = (category) => {
    return Object.keys(POST_CATEGORY).includes(category);
}

exports.validateCategory2 = (category1, category2) => {
    return POST_CATEGORY[category1].includes(category2);
}
