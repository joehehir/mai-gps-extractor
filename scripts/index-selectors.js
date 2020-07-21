const hashSum = require('hash-sum');

const hash = key => `${key}-${hashSum(key)}`;

module.exports = {
    form: hash('form'),
    input: hash('input'),
    template: hash('template'),
    ul: hash('ul'),
};
