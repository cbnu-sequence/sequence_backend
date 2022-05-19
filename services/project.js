const {updateFilesByIds, removeFilesByIds} = require("../util/file");

exports.updateFilesOf = async (project, user) => {
    const ids = (project.images || []);
    await Promise.all([
        updateFilesByIds(user, project._id, 'Project', ids),
    ]);
}

exports.removeFilesOf = async (project, user) => {
    const ids = (project.images || []);
    await Promise.all([
        removeFilesByIds(user, ids),
    ])
}
