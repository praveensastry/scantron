const formatError = (...errors) => {
    const result = [];
    for (const error of errors) {
        result.push({ msg: error });
    }
    return { errors: result };
};

module.exports = {
    formatError
}