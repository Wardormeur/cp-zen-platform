;(function() {
  'use strict';

var cdEventApplicationItem = {
  restrict: 'EA',
  bindings: {
    applications: '='
  },
  templateUrl: '/directives/tpl/event/applications/item',
  controller: ['$scope', '$state', 'cdUsersService', '$q', '$translate','cdEventsService', 'alertService', 'AlertBanner',
   function ($scope, $state, cdUsersService, $q, $translate, cdEventsService, alertService, AlertBanner) {
    var cdEAI = this;
    var promises = [];
    this.expanded = false;
    _.each(this.applications, function(application, index){
      var promise = cdUsersService.userProfileDataPromise({userId: application.userId}).then(function(profile){
        cdEAI.applications[index].profile = profile;
        cdEAI.applications[index].caption = application.name;
        cdEAI.applications[index].picture = '/api/2.0/profiles/'+ profile.id + '/avatar_img';
      });
      promises.push(promise);
    });
    $q.all(promises).then(function(){
      cdEAI.items = cdEAI.applications;
    });
    this.toggleVisibility = function(){
      cdEAI.expanded = !cdEAI.expanded;
    }

    this.expand = function ($event, item) {
      cdEAI.toggleVisibility();
      cdEAI.ticketSelected = item;
    }

    this.updateApplication = function (application, updateType) {
      var resetFlag = false;
      var successMessage;
      switch(updateType) {
        case 'status':
          updateStatus();
          break;
        case 'attendance':
          updateAttendance();
          break;
        case 'deleted':
          resetFlag = true;
          updateDeleted();
          break;
      }


      function updateStatus() {
        if (!$scope.userIsApproved(application)) {
          //Approve user
          application.status = 'approved';
          application.updateAction = 'approve';
          $scope.approved[application.id] = true;
          $scope.sessionStats[application.sessionId].attending++;
          $scope.eventStats.totalAttending++;
          if($scope.sessionStats[application.sessionId].waitlist > 0) {
            $scope.sessionStats[application.sessionId].waitlist--;
          }
          if($scope.eventStats.totalWaitlist > 0) $scope.eventStats.totalWaitlist--;
          successMessage = application.name + ' ' + $translate.instant('has been successfully approved');
        } else {
          //Disapprove user
          application.status = 'pending';
          application.updateAction = 'disapprove';
          $scope.approved[application.id] = false;
          $scope.sessionStats[application.sessionId].attending--;
          $scope.eventStats.totalAttending--;
          $scope.sessionStats[application.sessionId].waitlist++;
          $scope.eventStats.totalWaitlist++;
        }
      }

      function updateAttendance() {
        var date = moment.utc(application.applicationDates[0].date, 'Do MMMM YY').toISOString();
        application.updateAction = 'checkin';
        if(!$scope.userIsCheckedIn(application)) {
          if(!application.attendance) application.attendance = [];
          application.attendance.push(date);
          $scope.checkedIn[application.id] = true;
          successMessage = application.name + ' ' + $translate.instant('has been checked in');
        } else {
          application.attendance = _.without(application.attendance, date);
          $scope.checkedIn[application.id] = false;
        }
      }

      function updateDeleted() {
        application.updateAction = 'delete';
        application.deleted = true;
        successMessage = $translate.instant('Ticket for the following application has been successfully deleted:') + ' ' + application.name;
      }

      application = _.omit(application, ['user', 'age', 'parents', 'dateApplied', 'applicationDates', 'attendanceModel']);
      application.emailSubject = {
        'received': 'Your ticket request for %1$s has been received',
        'approved': 'Your ticket request for %1$s has been approved',
        'cancelled': 'Your ticket request for %1$s has been cancelled'
      };
      application.dojoId = dojoId;
      cdEventsService.bulkApplyApplications([application], function (applications) {
        if(_.isEmpty(applications)) return;
        if ($scope.showAlertBanner(applications[0], successMessage)) {
          AlertBanner.publish({
            type: 'info',
            message: successMessage,
            timeCollapse: 5000
          });
        } else if (applications.ok === false){
          alertService.showError($translate.instant('Error updating application') + '<br>' + applications.why);
        }
        if(resetFlag) $scope.loadPage(applications[0].sessionId);
      }, function (err) {
        if(err) alertService.showError($translate.instant('Error updating application') + '<br>' + JSON.stringify(err));
      });
    }

    this.userIsCheckedIn = function(application){
      var isCheckedIn = cdEAI.checkedIn[application.id];
      return !!isCheckedIn;
    }

    $scope.userIsApproved = function (application) {
      var isApproved = $scope.approved[application.id];
      return !!isApproved;
    }

  }],
  controllerAs: 'cdEAI',
};

angular
    .module('cpZenPlatform')
    .component('cdEventApplicationItem', cdEventApplicationItem);

}());
