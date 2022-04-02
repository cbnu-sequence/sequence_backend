const Validator = require('fastest-validator');
const v = new Validator();

const schema = {
   title: { type: "string"},
   content: { type: "string"}
};

const checker = v.compile(schema);

module.exports = checker;
