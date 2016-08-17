;(function() {
  'use strict';

var cdEventActions = {
  bindings: {
    event: '='
  },
  templateUrl: '/directives/tpl/event/event-actions',
  controllerAs: 'cdEA'
};

angular
    .module('cpZenPlatform')
    .component('cdEventActions', cdEventActions);
}());
