/* global ble */
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});