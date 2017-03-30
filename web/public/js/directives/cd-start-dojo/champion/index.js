;(function() {
  'use strict';

angular
    .module('cpZenPlatform')
    .component('cdSadChampion', {
      restrict: 'EA',
      templateUrl: '/directives/tpl/cd-start-dojo/champion/',
      bindings: {
        tabHeader: '=',
        save: '=',
        champion: '='
      },
      // TODO : dep injection array
      controller: function (userUtils, $state, cdDojoService) {
        var ctrl = this;
        ctrl.tabHeader = '100% complete';
        var initialDate = new Date();
        initialDate.setFullYear(initialDate.getFullYear() - 18);
        ctrl.dobDateOptions = {
          formatYear: 'yyyy',
          startingDay: 1,
          'datepicker-mode': "'year'",
          initDate: initialDate
        };
        ctrl.picker = {opened: false};

        ctrl.toggle = function () {
          ctrl.picker.opened = !ctrl.picker.opened;
        };

        ctrl.isKid = function () {
          ctrl.champion.isKid = userUtils.getAge(ctrl.champion.dateOfBirth) <= 18;
        };

        ctrl.save = function () {
          cdDojoService.saveDojoLead(ctrl.champion)
          .then(function () {
            $state.go('start-dojo.informations');
          });
        };

        ctrl.dateFormat = 'dd-MMMM-yyyy';
      }
    });
}());
