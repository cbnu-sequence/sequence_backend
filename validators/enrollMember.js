const Validator = require('fastest-validator');
const v = new Validator();

const schema = {
    team: {
        type: "string",
        enum: ["Project", "TechCourse", null]
    }
};

const checker = v.compile(schema);

module.exports = checker;
