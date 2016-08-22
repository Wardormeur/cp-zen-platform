(function () {
  'use strict';

  angular.module('cpZenPlatform').component('cdPictureGrid', {
    bindings: {
      items: '<',
      click: '='
    },
    templateUrl: '/directives/tpl/cd-picture-grid'
  });
})();
