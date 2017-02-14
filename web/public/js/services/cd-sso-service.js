'use strict';

angular.module('cpZenPlatform').service('cdSSOService',
['$http', '$q', function ($http, $q) {
  return {
    revoke: function (userId, appId, win, fail) {
      return $http({method: 'DELETE', url: '/api/3.0/user/' + userId + '/app/' + appId, cache: false});
    },
    searchWith: function (userId, win, fail) {
      return $http({method: 'GET', url: '/api/3.0/user/' + userId + '/app', cache: false});
    },
    get: function (appId, win, fail) {
      return $http({method: 'GET', url: '/api/3.0/oauth/app/' + appId, cache: false});
    }
  };
}]);
