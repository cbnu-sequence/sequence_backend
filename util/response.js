exports.createResponse = (res, data, message = 'OK', status = 200, success = true) => {
    res.status(status);
    return {
        success,
        status,
        message,
        data,
    };
};

exports.createPagingResponse = (res, count, data, message = 'OK', status = 200, success = true) => {
    res.status(status);
    return {
        success,
        status,
        message,
        count,
        data,
    };
};
