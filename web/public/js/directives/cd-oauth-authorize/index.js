;(function() {
  'use strict';

angular
    .module('cpZenPlatform')
    .component('cdOauthAuthorize', {
      restrict: 'EA',
      templateUrl: '/directives/tpl/cd-oauth-authorize',
      controller: ['$window', '$state', '$httpParamSerializer', '$http', function ($window, $state, $httpParamSerializer, $http) {
        var cdOA = this;
        cdOA.data = $state.params;
        // Should return a denial
        cdOA.cancel = function () {
          $window.history.back();
        }
      }],
      controllerAs: 'cdOA'
    })
}());
