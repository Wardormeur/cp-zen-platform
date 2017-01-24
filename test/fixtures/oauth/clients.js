'use strict';
var clients = [
    { id: '1', name: 'Samplr', clientId: 'abc123', clientSecret: 'ssh-secret',
      grants: ['authorization_code'], redirectUris: ['http://localhost:3002/auth/example-oauth2orize/callback'], scopes: ['profile'] },
    { id: '2', name: 'Samplr2', clientId: 'xyz123', clientSecret: 'ssh-password', grants: ['authorization_code'] }
];


exports.find = function(id) {
  for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i];
    if (client.id === id) {
      return client;
    }
  }
  return null;
};

exports.findByClientId = function(clientId) {
  for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i];
    if (client.clientId === clientId) {
      return client;
    }
  }
  return null;
};
