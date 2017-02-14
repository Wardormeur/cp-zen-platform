;(function() {
  'use strict';

angular
    .module('cpZenPlatform')
    .component('cdOauthAuthorize', {
      restrict: 'EA',
      templateUrl: '/directives/tpl/cd-oauth-authorize',
      controller: ['$window', '$state', '$httpParamSerializer', 'cdSSOService', function ($window, $state, $httpParamSerializer, cdSSOService) {
        var cdOA = this;
        cdOA.data = $state.params;
        cdSSOService.get(cdOA.data.client_id)
        .then(function (app) {
          cdOA.app = app.data;
        });
        // Should return a denial
        cdOA.cancel = function () {
          $window.history.back();
        };
      }],
      controllerAs: 'cdOA'
    });
}());
