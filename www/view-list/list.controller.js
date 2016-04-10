/* global ble */
angular.module('starter.controllers', [])

.controller('BLECtrl', function($scope, BLE) {
  var myself = this;

  // keep a reference since devices will be added
  myself.devices = BLE.devices;

  var success = function () {
      if (myself.devices.length < 1) {
          // a better solution would be to update a status message rather than an alert
          alert("Didn't find any Bluetooth Low Energy devices.");
      }
  };

  var failure = function (error) {
      alert(error);
  };

  // pull to refresh
  myself.onRefresh = function() {
      BLE.scan().then(
          success, failure
      ).finally(
          function() {
              $scope.$broadcast('scroll.refreshComplete');
          }
      )
  }

  // initial scan
  BLE.scan().then(success, failure);

})
