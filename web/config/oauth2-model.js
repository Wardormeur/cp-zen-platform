'use strict';
var db = require('../../test/fixtures/oauth');
var _ = require('lodash');
/**
 * Constructor.
 */
var that;

function InMemoryCache() {
  // this.clients = [{ clientId : 'ward-steward-2', clientSecret : 'something truly secret',
  //   redirectUris : ['http://localhost:3001/auth/example-oauth2orize/callback'], grants: ['authorization_code'] }];
  // this.tokens = [];
  // this.users = [{ id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' },
  //   { id: '2', username: 'joe', password: 'password', name: 'Joe Davis' }];
  // this.authorizationCodes = [];
  that = _.extend(this, db);

}

/**
 * Dump the cache.
 */

InMemoryCache.prototype.dump = function() {
  console.log('clients', that.clients);
  console.log('tokens', that.tokens);
  console.log('users', that.users);
};

/*
 * Get access token.
 */

InMemoryCache.prototype.getAccessToken = function(bearerToken) {
  return that.accessTokens.find(bearerToken);
};

/**
 * Save token.
 */

InMemoryCache.prototype.saveToken = function(token, client, user) {
  return that.accessTokens.save({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client: {
      id: client.clientId
    },
    user: {
      id: user.id
    },
    clientId: client.clientId,
    userId: user.id,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt
  });
};


/**
 * Get refresh token.
 */

InMemoryCache.prototype.getRefreshToken = function(bearerToken) {
  var token = that.tokens.find(bearerToken);

  return token || false;
};

/**
 * Get client.
 */

InMemoryCache.prototype.getClient = function (clientId, clientSecret) {
  var client = that.clients.findByClientId(clientId); // lazy auth ;
  return client || false; // && client.clientSecret === clientSecret ? client :
};


/*
 * Get user.
 */

InMemoryCache.prototype.getUser = function(username, password) {
  var user = that.users.findByUsername(username);
  return user.password === password ? user : false;
};

/*
 * Save authorization code.
 * @returns Object authorization_code authorizationCode used in the lib to append to the body request
 */

InMemoryCache.prototype.saveAuthorizationCode = function (authorization_code, client, user) {
  // TODO : omit secrets
  authorization_code.client = client;
  authorization_code.user = user.user;
  that.authorizationCodes.save(authorization_code);
  return authorization_code;
};

InMemoryCache.prototype.getAuthorizationCode = function (code) {
  return that.authorizationCodes.find(code) || null;
}

InMemoryCache.prototype.revokeAuthorizationCode = function (arg) {
  return that.authorizationCodes.remove(arg);
}

InMemoryCache.prototype.verifyScope = function (token, scope) {
  var clientDef = that.clients.findByClientId(token.client.id);
  console.log(token.client.id, clientDef);
  return clientDef? clientDef.scopes.indexOf(scope) > -1 : false;
}


/**
 * Export constructor.
 */

module.exports = InMemoryCache;
