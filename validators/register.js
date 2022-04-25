const Validator = require('fastest-validator');
const v = new Validator();

const schema = {
   email: { type: "email"},
   password: { type: "string", min: 8, max:20},
   name: { type: "string", min: 2, max: 20},
   phoneNumber: {type: "string", max: 11, min: 10},
   $$strict: true,
};

const checker = v.compile(schema);

module.exports = checker;
