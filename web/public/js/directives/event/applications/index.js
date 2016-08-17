;(function() {
  'use strict';

function cdEventApplications(){
    return {
      restrict: 'EA',
      templateUrl: '/directives/tpl/event/applications',
      controller: ['$scope', function ($scope) {
      }],
      controllerAs: 'cdEA',
    };
  }

angular
    .module('cpZenPlatform')
    .directive('cdEventApplications', [cdEventApplications]);

}());
