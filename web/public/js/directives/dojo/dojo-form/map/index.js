;(function() {
  'use strict';
  /* global google */
angular
  .module('cpZenPlatform')
  .component('cdDojoFormMap', {
    restrict: 'EA',
    templateUrl: '/directives/tpl/dojo/dojo-form/map',
    bindings: {
      ngModel: '=',
      mapOptions: '=',
      model: '=',
      addMarker: '=',
      setLocation: '='
    },
    controller: function (utilsService, Geocoder, cdDojoService, alertService,
      $translate, $timeout, $scope) {
      var ctrl = this;
      ctrl.$onInit = function () {
        ctrl.places = [];
        ctrl.countries = [];
        ctrl.geoPointSet = false;
        cdDojoService.listCountries(function (countries) {
          ctrl.countries = countries;
        });
      };
      $scope.$watch('$ctrl.ngModel.country', function () {
        if (!_.isUndefined(ctrl.ngModel.country)) {
          ctrl.getBoundariesFromCountry();
        }
      });
      // Init manually set marker
      var initMarker2 = $scope.$watchGroup(['$ctrl.ngModel.geoPoint', '$ctrl.mapOptions'], function () {
        if (_.isEmpty(ctrl.model.markers) && !ctrl.geoPointSet) {
          if (!_.isUndefined(ctrl.mapOptions) && ctrl.ngModel.geoPoint) {
            ctrl.setPoint(ctrl.ngModel.geoPoint);
          }
        } else {
          initMarker2();
        }
      }, true);

      ctrl.getPlaces = function ($select) {
        if (ctrl.ngModel.country && ctrl.ngModel.country.alpha2) {
          return utilsService.getPlaces(ctrl.ngModel.country.alpha2, $select).then(function (data) {
            ctrl.places = data;
          }, function (err) {
            ctrl.places = [];
          });
        }
      };

      ctrl.setCountry = function (country) {
        ctrl.ngModel.country = _.pick(country, ['countryName', 'continent', 'alpha2', 'alpha3']);
      };

      ctrl.getBoundariesFromCountry = function () {
        Geocoder.boundsForCountry(ctrl.ngModel.country.countryName)
        .then(function (bounds) {
          $timeout(function () {
            console.log('fitBounds');
            ctrl.model.map.fitBounds(bounds);
          });
        });
      };

      ctrl.setLocation = function (latLng) {
        ctrl.ngModel.geoPoint = {
          lat: latLng.lat(),
          lon: latLng.lng()
        };
        ctrl.setPoint(ctrl.ngModel.geoPoint);
      };

      ctrl.setPlace = function (place) {
        ctrl.ngModel.place = _.omit(place, '$$hashKey');
        if (!ctrl.model.markers.length && !_.isUndefined(ctrl.ngModel.place)) {
          ctrl.getLocationFromAddress();
        }
      };

      ctrl.setPoint = function (geoPoint) {
        ctrl.mapOptions.center = new google.maps.LatLng(geoPoint.lat, geoPoint.lon);
        $timeout(function () {
          ctrl.model.map.panTo(ctrl.mapOptions.center);
        });
        ctrl.addMarker(null, [{latLng: ctrl.mapOptions.center}]);
        ctrl.geoPointSet = true;
      };

      ctrl.getLocationFromAddress = function () {
        //the extend is a hack for backward compat
        utilsService.getLocationFromAddress(_.cloneDeep(ctrl.ngModel))
        .then(function (data) {
          ctrl.ngModel.geoPoint = {
            lat: data.lat,
            lon: data.lng
          };
          ctrl.setPoint(ctrl.ngModel.geoPoint);
        }, function (err) {
          //Ask user to add location manually if google geocoding can't find location.
          alertService.showError($translate.instant('Please add your location manually by clicking on the map.'));
        });
      };
    }
  });
}());
