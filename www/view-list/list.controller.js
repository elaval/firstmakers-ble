/* global ble */
angular.module('ble101')

.controller('BLECtrl', ['$scope','$ionicPlatform','$cordovaDevice', '$cordovaBLE', '_','$interval', function($scope,$ionicPlatform,$cordovaDevice, $cordovaBLE, _, $interval) {
  var myself = this;

  // keep a reference since devices will be added
  myself.devices = [];
  myself.devices101 = [];
  myself.devicesOther = [];
  myself.scanning = false;
  

  var success = function () {
      myself.scanning = false;  
      $scope.$broadcast('scroll.refreshComplete');
      
      if (myself.devices.length < 1) {
          // a better solution would be to update a status message rather than an alert
          alert("Didn't find any Bluetooth Low Energy devices.");
      }
      
    myself.devices101 = [];
    myself.devicesOther = [];
    
    var platform = $cordovaDevice.getPlatform();
    console.log(platform);
    
    _.each(myself.devices, function(d) {
      
      if (platform == 'iOS') {
        d.localName = d.advertising.kCBAdvDataLocalName;
      }
      else if (platform == 'Android') {
        d.localName = d.name;
        var adData = new Uint8Array(d.advertising);
      }
      
      if (d.localName == "BLE101") {
        myself.devices101.push(d);
      } else {
        myself.devicesOther.push(d);
      }
    })
  };

  var failure = function (error) {
      myself.scanning = false;  
      $scope.$broadcast('scroll.refreshComplete');
      alert(error);
  };
  
  var progress = function (c) {
      myself.devices.push(c);
  };

  // pull to refresh
  myself.onRefresh = function() {
      myself.scanning = true;
      
      $ionicPlatform.ready()
      .then(function() {
        myself.devices = [];
        $cordovaBLE.scan([],5)
        .then(
          success,
          failure,
          progress
        );
      })
      .finally(
          function() {
              
          }
      );
      
      
      /*
      BLE.scan().then(
          success, failure
      ).finally(
          function() {
              myself.scanning = false;  
              $scope.$broadcast('scroll.refreshComplete');
          }
      )
      */
  }

  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    myself.onRefresh();
  });


  // initial scan
  //myself.onRefresh();
  //BLE.scan().then(success, failure);

}])
