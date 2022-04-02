const {updateFilesByUrls, removeFilesByUrls} = require('../util/file')

exports.updateFilesOf = async (post, user) => {
    const urls = [post.content, ...(post.files || []).map(post => post.url)];
    await Promise.all([
        updateFilesByUrls(user, post._id, 'Post', urls),
    ]);
}

exports.removeFilesOf = async (post, user) => {
    const urls = [post.content, ...(post.files || []).map(post => post.url)];
    await Promise.all([
        removeFilesByUrls(user, urls),
    ])
}