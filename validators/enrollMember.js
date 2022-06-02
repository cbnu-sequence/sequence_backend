const Validator = require('fastest-validator');
const v = new Validator();

const schema = {
    team: {
        type: "string",
        enum: ["Project", "TechCourse", null]
    },
    githubUrl: {
        type: "string"
    },
    otherUrls: {
        type: "string"
    },
    comment: {
        type: "string"
    }
};

const checker = v.compile(schema);

module.exports = checker;
