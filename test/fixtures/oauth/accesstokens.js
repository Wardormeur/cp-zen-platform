'use strict';
var tokens = {};

exports.find = function(key) {
  var token = tokens[key];
  return token;
};

exports.save = function(token) {
  tokens[token.accessToken] = token;
  return token;
};
