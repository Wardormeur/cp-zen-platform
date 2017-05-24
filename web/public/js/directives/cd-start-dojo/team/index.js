;(function() {
  'use strict';

angular
    .module('cpZenPlatform')
    .component('cdSadTeam', {
      restrict: 'EA',
      templateUrl: '/directives/tpl/cd-start-dojo/team/',
      bindings : {
        team: '='
      },
      //TODO : dep injection array
      controller: function ($translate, cdDojoService, atomicNotifyService) {
        var ctrl = this;
        ctrl.$onInit = function () {
          // Ids must be synchronized with Joi payload validation
          ctrl.srcMentors = {
            community: {value: $translate.instant('Youth/Community Workers')},
            teachers: {value: $translate.instant('Primary or Secondary Teachers')},
            pro: {value: $translate.instant('IT Professionals')},
            students: {value: $translate.instant('3rd level education students')},
            staff: {value: $translate.instant('Staff of Venue')},
            youth: {value: $translate.instant('Youth Mentors (under 18)')},
            parents: {value: $translate.instant('Parents of attendees')},
            other: {value: $translate.instant('Other')}
          };
          ctrl.setSrcMentorsValue = function (key) {
            if (!ctrl.team.src[key]) delete ctrl.team.src[key];
          };
        };
      }
    });
}());
