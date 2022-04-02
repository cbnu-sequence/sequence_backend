const {updateFilesByUrls, removeFilesByUrls, updateFilesByIds, removeFilesByIds} = require('../util/file')

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