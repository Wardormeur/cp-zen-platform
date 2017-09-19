

const programmingLanguages = require('../../config/programmingLanguages.js');

module.exports = [{
  method: 'GET',
  path: '/programming-languages',
  handler(request, reply) {
    if (programmingLanguages.length < 1) {
      return reply({ error: 'List is empty' }).code(404);
    }

    reply(programmingLanguages);
  },
}];
