'use strict';
var _ = require('lodash');
var auth = require('./../authentications');

exports.register = function (server, options, next) {
  options = _.extend({ basePath: '/api/3.0' }, options);
  var handlers = require('./../handlers.js')(server, 'cd-oauth2');
  server.route([{
    method: 'POST',
    path: options.basePath + '/oauth/authorize',
    handler: {'oauth2-authorize': {
      authenticateHandler: {
        handle: function () {
          return {user: { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' }};
        }
      }}
    },
    config: {
      auth: auth.basicUser,
      description: 'Request authorisation',
      tags: ['api', 'users']
    }
  }, {
    method: 'POST',
    path: options.basePath + '/oauth/token',
    handler: {'oauth2-token': {}},
    config: {

      description: 'Request token',
      tags: ['api', 'users']
    }
  }, {
    method: 'GET',
    path: options.basePath + '/oauth/profile',
    handler: function (req, rep) {
        var payload = {
           me: req.user,
           message: 'Authorization success, Without Scopes, Try accessing /profile with `profile` scope',
           description: 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28',
           more: 'pass `profile` scope while Authorize'
        };
        rep(payload);
    },
    config: {
      auth: 'oauth2-token',
      description: 'Get user profile',
      plugins: {
        HapiOAuthServer: {
          allowBearerTokensInQueryString: true
        }
      },
      tags: ['api', 'users']
    }
  },  {
    method: 'GET',
    path: options.basePath + '/oauth/me',
    handler: function (req, rep) {
      server.plugins.HapiOAuthServer.oauth.authenticate(null, {scope:'profile', allowBearerTokensInQueryString: true, isHandler: true})(req, rep)
      .then( function (token, arg2, arg3) {
        var payload = {
           me: req.user,
           message: 'Authorization success, With Scope profile',
           description: 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28'
        };
        return rep(payload);
      });
    },
    config: {
      // auth: 'oauth2-token',
      // plugins: {
      //   HapiOAuthServer: {
      //     scope:'profile',
      //     allowBearerTokensInQueryString: true
      //   }
      // },
      description: 'Get user profile',
      tags: ['api', 'users']
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-3.0_oauth'
};
