;(function() {
  'use strict';

var cdEventSessionCapacity = {
    bindings: {
      capacity: '<',
      booked: '<',
      waiting: '<?'
    },
    templateUrl: '/directives/tpl/event/session/capacity',
    controller: ['$scope', function ($scope) {

    }],
    controllerAs: 'cdESC',
};

angular
    .module('cpZenPlatform')
    .component('cdEventSessionCapacity', cdEventSessionCapacity);

}());
