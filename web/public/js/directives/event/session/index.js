;(function() {
  'use strict';

function cdEventSession(){
    return {
      restrict: 'EA',
      templateUrl: '/directives/tpl/event/session',
      controller: ['$scope', function ($scope) {
      }],
      controllerAs: 'cdES',
    };
  }

angular
    .module('cpZenPlatform')
    .directive('cdEventSession', [cdEventSession]);

}());
