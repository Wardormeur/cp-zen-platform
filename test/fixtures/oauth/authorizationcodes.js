'use strict';
var codes = {};


exports.find = function(key) {
  var code = codes[key];
  return code || null;
};

exports.save = function(code) {
  codes[code.authorizationCode] = code;
};

exports.remove = function (code) {
  var deleted = false;
  if (!!codes[code.authorizationCode]) {
    delete codes[code.authorizationCode];
    deleted = true;
  }
  return deleted;
}
