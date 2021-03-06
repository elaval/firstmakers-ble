/* global ble */
angular.module('ble101')

.controller('BLEDetailCtrl', function($scope, $cordovaBLE, $stateParams, BLE, _, $timeout, $interval) {
  var myself = this;
  
  
  myself.value = {}; // Values for each digital pin
  myself.analogPins = [];
  myself.digitalPins = [];
  myself.historicData = {};
  
  
  var historyPoints = 60;
  var deviceId = $stateParams.deviceId;

  function monitorDevice(peripheral) {

    /**
     * For ios:
     * peripheral.name
     * peripheral.id
     * peripheral.rssi
     * peripheral.advertising.kCBAdvDataIsConnectable
     * peripheral.advertising.kCBAdvDataLocalName
     * peripheral.advertising.kCBAdvDataServiceUUIDs
     */
    
    myself.device = peripheral;
    myself.device_id = peripheral.id;

    _.each(peripheral.characteristics, function(d) {
      
      var pinType = d.characteristic.substring(0,2).toUpperCase();
      if (pinType=="AA") {
        d.pinName = "A"+d.characteristic.substring(3,4);
        myself.analogPins.push(d);
      } else if (pinType=="DD") {
        d.pinName = "D"+d.characteristic.substring(2,4);
        myself.digitalPins.push(d);
      }
      
      myself.historicData[d.pinName] = [];
      
      _.each(_.range(historyPoints), function(i) {
        myself.historicData[d.pinName][i]=null;
      });
      
      console.log(d.characteristic, d.service);


      $cordovaBLE.read(myself.device_id, d.service, d.characteristic,
        function(buffer) {
          // assuming heart rate measurement is Uint8 format, real code should check the flags
          // See the characteristic specs http://goo.gl/N7S5ZS
          var data = new Uint8Array(buffer);
          console.log("buffer",d.characteristic,data, data[1]);
          
          if (pinType=="DD") {
            $scope.$apply(function() {
              //d.value = data;
              console.log(d.characteristic,d.value, d);
            })
          } else if (pinType=="AA") {
            $scope.$apply(function() {
              d.value = 256*data[0]+data[1];
              console.log(d.characteristic,d.value, d);
            })            
          }
        },
        function(err) {
          console.log(err);
        }  
      );      
      
            
      $cordovaBLE.startNotification(myself.device_id, d.service, d.characteristic,
        function(buffer) {
          
          var data = new Uint8Array(buffer);
          if (pinType=="DD") {
            $scope.$apply(function() {
              //d.value = data;
              myself.value[d.characteristic] = data[0]==1;
              console.log(d.characteristic,data,d.value, d, myself.value);
            })
          } else if (pinType=="AA") {
            $scope.$apply(function() {
              d.value = 256*data[0]+data[1];
            })            
          }

        },
        function(err) {
          console.log(err);
        }
      )  
          
      $interval(function() {
        myself.historicData[d.pinName].push(d.value);
        // Keep 60 seconds of history
        if (myself.historicData[d.pinName].length > 60) {
          myself.historicData[d.pinName].splice(0,1);
        }
      }, 1000)
      
    });
  }
  
  BLE.connect($stateParams.deviceId).then(
      function(peripheral) {

      }
  );


  myself.isDigital = function(item) {
    return item.characteristic.indexOf("DD") > -1;
  }


  myself.changeSwitch = function(device_id, service_uuid, characteristic_uuid) {
    var data = new Uint8Array(1);

    data[0] = myself.value[characteristic_uuid] ? 1 : 0;

    $cordovaBLE.write(device_id, service_uuid, characteristic_uuid, data.buffer)
    .then(function() {
      console.log("Written ", myself.value[characteristic_uuid]);
    })
  }
  
  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    $cordovaBLE.connect(deviceId)
    .then(function(peripheral) {
      monitorDevice(peripheral)
    })
  });
  
  $scope.$on( "$ionicView.leave", function( scopes, states ) {
    $cordovaBLE.disconnect(deviceId);
  });

  
})

