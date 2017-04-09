;(function() {
  'use strict';

angular
    .module('cpZenPlatform')
    .component('cdSadCharter', {
      restrict: 'EA',
      templateUrl: '/directives/tpl/cd-start-dojo/charter/',
      //TODO : dep injection array
      bindings : {
        tabHeader: '=',
        charter: '='
      },
      controller: function ($scope, $translate) {
        var ctrl = this;
        console.log($scope, this);
      }
    });
}());
