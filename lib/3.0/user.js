'use strict';
var _ = require('lodash');
var auth = require('./../authentications');

exports.register = function (server, options, next) {
  options = _.extend({ basePath: '/api/3.0/user' }, options);
  var oauthHandlers = require('./../handlers.js')(server, 'cd-sso');
  server.route([{
    method: 'DELETE',
    path: options.basePath + '{{userId}}/app/{{appId}}',
    handler: oauthHandlers.actHandler('delete', ['userId', 'appId'], null, {ctrl: 'app-approval'}),
    config: {
      auth: auth.basicUser,
      description: 'Remove an app authorisation from an user',
      tags: ['api', 'users', 'oauth']
    }
  },
  {
    method: 'GET',
    path: options.basePath + '{{userId}}/app',
    handler: oauthHandlers.actHandler('searchWith', ['userId'], null, {ctrl: 'app-approval'}),
    config: {
      auth: auth.basicUser,
      description: 'List the available apps for an user',
      tags: ['api', 'users', 'oauth']
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-3.0_oauth'
};
