'use strict';
// var bearer = require('hapi-auth-bearer-token');
var oauth2 = require('./../../../../../../hapi-oauth-server/plugin');

module.exports.register = function (server) {
  var Model = new (require('../../models/oauth2'))(server.seneca);
  //  continueMiddleware: true,
  server.register({register: oauth2, options:
      {model: Model, allowEmptyState: true}},
    function (err) {
      console.log(err);
    });
};

exports.register.attributes = {
  name: 'api-3.0_oauth-lib'
};
