;(function() {
  'use strict';

function cdEventApplications(){
    return {
      restrict: 'EA',
      templateUrl: '/directives/tpl/event/applications',
      controllerAs: 'cdEA',
    };
  }

angular
    .module('cpZenPlatform')
    .directive('cdEventApplications', [cdEventApplications]);

}());
