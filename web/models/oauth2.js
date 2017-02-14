'use strict';
var _ = require('lodash');
/**
 * Constructor.
 */
var plugin = 'cd-sso';
var that = {};

function OAuth2Model (seneca) {
  that.seneca = seneca;
}

/*
 * Get access token.
 */

OAuth2Model.prototype.getAccessToken = function (bearerToken, done) {
  console.log('getAccessToken', bearerToken);
  that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'getBy', query: {token: bearerToken}}, function (err, approval) {
    if (err || !approval) return done(new Error('Token not found'));
    done(null, {user: {id: approval.userId}, token: bearerToken});
  });
};

/**
 * Save token.
 */

OAuth2Model.prototype.saveToken = function (token, client, user, done) {
  console.log('saveToken', token, client, user);
  that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'getBy', query: {
    appId: client.id,
    userId: user.id
  }}, function (err, approval) {
    console.log('errSaveToken', approval);
    if (err) return done(new Error('Retrieving approval failed'));
    that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'update', approval: {
      appId: client.id,
      token: token.accessToken
    }, user: user}, function (err, approval) {
      if (err || !approval) return done(new Error('Invalid token'));
      done(null, {accessToken: approval.token,
        client: {
          id: approval.appId
        },
        user: {
          id: approval.userId
        },
        clientId: approval.appId,
        userId: approval.userId
      });
    });
  });
};

/**
 * Get refresh token.
 */

OAuth2Model.prototype.getRefreshToken = function (bearerToken, done) {
  console.log('getRefreshToken');
  that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'getBy', token: bearerToken}, function (err, token) {
    if (err || !token) return done(new Error('Invalid bearerToken'));
    return done(null, token);
  });
};

/**
 * Get client.
 */

OAuth2Model.prototype.getClient = function (clientId, clientSecret, done) {
  that.seneca.act({role: plugin, ctrl: 'app', cmd: 'get', id: clientId}, function (err, app) {
    console.log('err', app, clientId, clientSecret);
    if (err || !app) return done(new Error('Invalid clientId'));
    if (app.id === clientId) { //  && app.secretKey === clientSecret
      return done(null, {id: app.id, scopes: app.fields,
        redirectUris: [app.callbackUrl], grants: ['authorization_code']});
    }
    return done(new Error('Invalid client'));
  });
};

/*
 * Get user.
 */

OAuth2Model.prototype.getUser = function (username, password, done) {
  // TODO : password ? wtf ?
  console.log('getUser', username, password);
  that.seneca.act({role: 'cd-profiles', cmd: 'search', query: {'name': username}}, function (err, profile) {
    if (err) return done(new Error('User not found'));
    return done(null, profile);
  });
  // return user.password === password ? user : false;
};

/*
 * Save authorization code.
 * @returns Object authorization_code authorizationCode used in the lib to append to the body request
 */

OAuth2Model.prototype.saveAuthorizationCode = function (authorization_code, client, user, done) {
  // TODO : omit secrets
  //  get approval for user/client if exists
  that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'search', query: {appId: client.id, userId: user.id}}, function (err, approval) {
    if (err) return done(new Error('Client not found'));
    if (_.isEmpty(approval)) {
      var payload = {
        appId: client.id,
        authorizationCode: authorization_code.authorizationCode,
        expiresAt: authorization_code.expiresAt
      };
      that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'create', approval: payload, user: user.user}, function (err, newApproval) {
        console.log('newApproval', newApproval);
        if (err) return done(new Error('Invalid approval payload'));
        return done(null, {
          authorizationCode: newApproval.authorizationCode,
          user: { id: newApproval.userId },
          userId: newApproval.userId,
          client: { id: newApproval.appId },
          clientId: newApproval.appId
        });
      });
    } else {
      // Should we allow update of approval? Doubt so.
      return done(new Error('Unexected update of an approval'));
    }
  });
};

OAuth2Model.prototype.getAuthorizationCode = function (code, done) {
  console.log('getAuthorizationCode');
  that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'getBy', query: {authorizationCode: code}}, function (err, approval) {
    if (err || !approval) return done(new Error('Invalid authorizationCode'));
    console.log('authorizationCode', approval);
    return done(null, {
      client: {id: approval.appId},
      authorizationCode: code,
      expiresAt: new Date(approval.expiresAt),
      user: {id: approval.userId}
    });
  });
};

OAuth2Model.prototype.revokeAuthorizationCode = function (approval, done) {
  console.log('revokeAuthCode', approval);

  that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'revokeAuthCode', approval: {
    appId: approval.client.id,
    authorizationCode: approval.authorizationCode
  }, user: approval.user}, function (err, approval) {
    if (err || !approval) return done(new Error('Invalid authorizationCode'));
    return done(null, true);
  });
};

OAuth2Model.prototype.verifyScope = function (query, scope, done) {
  that.seneca.act({role: plugin, ctrl: 'app-approval', cmd: 'getWith',
    query: {token: query.token}}, function (err, extendedApproval) {
    if (err) return done(new Error('Approval not found'));
    // TODO : translation from scope to fields
    return done(null, extendedApproval && extendedApproval.fields.indexOf(scope) > -1);
  });
};

/**
 * Export constructor.
 */

module.exports = OAuth2Model;
