/* global ble */
angular.module('starter.controllers', [])

.controller('BLEDetailCtrl', function($scope, $stateParams, BLE) {
  var myself = this;
  $scope.switch = {value: false};
  
  myself.value = {};


  BLE.connect($stateParams.deviceId).then(
      function(peripheral) {
          myself.device = peripheral;

          myself.device_id = peripheral.id;
          
          //var d = peripheral.characteristics[0];
          

          _.each(peripheral.characteristics, function(d) {
            console.log(d.characteristic, d.service);

 
              ble.read(myself.device_id, d.service, d.characteristic,
                function(buffer) {
                  // assuming heart rate measurement is Uint8 format, real code should check the flags
                  // See the characteristic specs http://goo.gl/N7S5ZS
                  var data = new Uint8Array(buffer);
                  console.log("buffer",d.characteristic,data, data[1]);
                  
                  $scope.$apply(function() {
                    d.value = 256*data[0]+data[1];
                    //d.value = data[0];
                  })
                },
                function(err) {
                  console.log(err);
                }  
              );      
              
                    
              ble.startNotification(myself.device_id, d.service, d.characteristic,
                function(buffer) {
                  // assuming heart rate measurement is Uint8 format, real code should check the flags
                  // See the characteristic specs http://goo.gl/N7S5ZS
                  var data = new Uint8Array(buffer);
                  //console.log("buffer",d.characteristic,data, data[1]);
                  $scope.$apply(function() {
                    d.value = 256*data[0]+data[1];
                    //d.value = data[0];
                  })

                },
                function(err) {
                  console.log(err);
                })  
          });
      }
  );


  myself.isDigital = function(item) {
    return item.characteristic.indexOf("DD") > -1;
  }


  myself.changeSwitch = function(device_id, service_uuid, characteristic_uuid) {
    var data = new Uint8Array(1);

    data[0] = myself.value[characteristic_uuid] ? 1 : 0;

    BLE.write(device_id, service_uuid, characteristic_uuid, data.buffer)
    .then(function() {
      console.log("Written ", myself.value[characteristic_uuid]);
    })
  }
})

