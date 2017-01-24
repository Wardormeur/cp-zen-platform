'use strict';
var auth = require('../../../lib/authentications');

var controller = module.exports = [
  {
    method: 'GET',
    path: '/oauth/authorize',
    handler: function (request, reply) {
      reply.view('index', request.locals);
    }
  }
];
