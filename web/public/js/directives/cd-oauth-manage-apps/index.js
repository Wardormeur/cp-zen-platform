;(function() {
  'use strict';

angular
    .module('cpZenPlatform')
    .component('cdOauthManageApps', {
      restrict: 'EA',
      templateUrl: '/directives/tpl/cd-oauth-manage-apps',
      controller: ['$state', 'cdSSOService', 'loggedInUser', function ($state, cdSSOService, loggedInUser) {
        var cdOMP = this;

        cdSSOService.searchWith(loggedInUser.user.id)
        .then(function (apps) {
          cdOMP.apps = apps;
        });

        cdOMP.revoke = function (app) {
          cdSSOService.revoke(loggedInUser.user.id, app.id);
        };
      }],
      controllerAs: 'cdOA'
    });
}());
