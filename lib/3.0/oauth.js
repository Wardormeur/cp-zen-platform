'use strict';
var _ = require('lodash');
var auth = require('./../authentications');

exports.register = function (server, options, next) {
  options = _.extend({ basePath: '/api/3.0/oauth' }, options);
  var handlers = require('./../handlers.js')(server, 'cd-sso');
  server.route([{
    method: 'GET',
    path: options.basePath + '/app/{id}',
    handler: handlers.actHandler('get', ['id'], null, {ctrl: 'app'}),
    config: {
      description: 'Get an app details',
      tags: ['api', 'oauth']
    }
  }, {
    method: 'POST',
    path: options.basePath + '/authorize',
    handler: {'oauth2-authorize': {
      authenticateHandler: {
        handle: function (request, reply) {
          console.log('/authorize handler', request.user);
          // TODO ensure that user is passed down in hapi-oauth-server
          return request.user;
        }
      }}
    },
    config: {
      auth: auth.basicUser,
      description: 'Request authorisation for a given app',
      tags: ['api', 'oauth']
    }
  }, {
    method: 'POST',
    path: options.basePath + '/token',
    handler: {'oauth2-token': {}},
    config: {

      description: 'Request token',
      tags: ['api', 'oauth']
    }
  }, {
    method: 'GET',
    path: options.basePath + '/profile',
    handler: function (req, rep) {
      var payload = {
        me: req.user,
        message: 'Authorization success, Without Scopes, Try accessing /profile with `profile` scope',
        description: 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28',
        more: 'pass `profile` scope while Authorize'
      };
      console.log('/profile', payload);
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
      tags: ['api', 'users', 'oauth']
    }
  }, {
    method: 'GET',
    path: options.basePath + '/me',
    handler: function (req, rep) {
      // server.plugins.HapiOAuthServer.oauth.authenticate(null, {scope: 'profile', allowBearerTokensInQueryString: true, isHandler: true})(req, rep)
      // .then(function (token, arg2, arg3) {

        var payload = {
          me: req.user,
          message: 'Authorization success, With Scope profile',
          description: 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28'
        };
        console.log('/me', payload, _.keys(req));
        return rep(payload);
      // });
    },
    config: {
      auth: 'oauth2-token',
      plugins: {
        HapiOAuthServer: {
          scope: 'profile',
          allowBearerTokensInQueryString: true
        }
      },
      description: 'Get user profile',
      tags: ['api', 'users', 'oauth']
    }
  }]);

  next();
};

exports.register.attributes = {
  name: 'api-3.0_oauth'
};
