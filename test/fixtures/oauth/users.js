'use strict';
var users = [
    { id: '1', username: 'bob', password: 'secret', name: 'Bob Smith' },
    { id: '2', username: 'joe', password: 'password', name: 'Joe Davis' }
];


exports.find = function(id, done) {
seneca.act({role: 'cd_profiles', cmd: 'load', id: id})
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.id === id) {
      return user;
    }
  }
  return null;
};

exports.findByUsername = function(username, done) {
  seneca.act({role: 'cd_profiles', cmd: 'search', query: {'name': username}})
  // for (var i = 0, len = users.length; i < len; i++) {
  //   var user = users[i];
  //   if (user.username === username) {
  //     return user;
  //   }
  // }
  return null;
};
