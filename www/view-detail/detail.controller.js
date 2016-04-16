/* global ble */
angular.module('ble101')

.controller('BLEDetailCtrl', function($scope, $stateParams, BLE, _, $timeout, $interval) {
  var myself = this;
  
  
  myself.value = {}; // Values for each digital pin
  myself.analogPins = [];
  myself.digitalPins = [];
  myself.historicData = {};
  
  var historyPoints = 60;

  
  BLE.connect($stateParams.deviceId).then(
      function(peripheral) {
          myself.device = peripheral;
          myself.device_id = peripheral.id;

          
          /**
           * device.
           * name
           * id
           * rssi
           * advertising.kCBAdvDataIsConnectable
           * advertising.kCBAdvDataLocalName
           * advertising.kCBAdvDataServiceUUIDs
           */
          
 
          _.each(peripheral.characteristics, function(d) {
            
            var pinType = d.characteristic.substring(0,2);
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

 
            ble.read(myself.device_id, d.service, d.characteristic,
              function(buffer) {
                // assuming heart rate measurement is Uint8 format, real code should check the flags
                // See the characteristic specs http://goo.gl/N7S5ZS
                var data = new Uint8Array(buffer);
                console.log("buffer",d.characteristic,data, data[1]);
                
                $scope.$apply(function() {
                  d.value = 256*data[0]+data[1];
                  
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
                  
                  
                  //console.log(d.characteristic, d.value, d.history)
                })

              },
              function(err) {
                console.log(err);
              })  
                
            $interval(function() {
              myself.historicData[d.pinName].push(d.value);
              // Keep 60 seconds of history
              if (myself.historicData[d.pinName].length > 60) {
                myself.historicData[d.pinName].splice(0,1);
              }
            }, 1000)
            
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

