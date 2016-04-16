/* global ble */
angular.module('ble101')

.controller('BLECtrl', ['$scope', 'BLE', '_','$interval', function($scope, BLE, _, $interval) {
  var myself = this;

  // keep a reference since devices will be added
  myself.devices = BLE.devices;
  myself.devices101 = [];
  myself.devicesOther = [];
  myself.scanning = false;
  

  var success = function () {
      if (myself.devices.length < 1) {
          // a better solution would be to update a status message rather than an alert
          alert("Didn't find any Bluetooth Low Energy devices.");
      }
      
    myself.devices101 = [];
    myself.devicesOther = [];
      
    _.each(BLE.devices, function(d) {
      if (d.advertising.kCBAdvDataLocalName == "BLE101") {
        myself.devices101.push(d);
      } else {
        myself.devicesOther.push(d);
      }
    })
  };

  var failure = function (error) {
      alert(error);
  };

  // pull to refresh
  myself.onRefresh = function() {
      myself.scanning = true;
      myself.devices101 = [];
      myself.devicesOther = [];
      
      BLE.scan().then(
          success, failure
      ).finally(
          function() {
              myself.scanning = false;  
              $scope.$broadcast('scroll.refreshComplete');
          }
      )
  }

  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    myself.onRefresh();
  });


  // initial scan
  //myself.onRefresh();
  //BLE.scan().then(success, failure);

}])
