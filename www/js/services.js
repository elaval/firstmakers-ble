angular.module('ble101')

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('BLE', function($q, $ionicPlatform) {

  var connected;

  return {

    devices: [],

    scan: function() {
        var that = this;
        var deferred = $q.defer();

        that.devices.length = 0;

        // disconnect the connected device (hack, device should disconnect when leaving detail page)
        if (connected) {
            var id = connected.id;
            ble.disconnect(connected.id, function() {
                console.log("Disconnected " + id);
            });
            connected = null;
        }

        $ionicPlatform.ready()
        .then(function() {
            ble.startScan([],  /* scan for all services */
                function(peripheral){
                    that.devices.push(peripheral);
                },
                function(error){
                    deferred.reject(error);
                });

            // stop scan after 5 seconds
            setTimeout(ble.stopScan, 5000,
                function() {
                    deferred.resolve();
                },
                function() {
                    console.log("stopScan failed");
                    deferred.reject("Error stopping scan");
                }
            );       

        })

        return deferred.promise;
    },
    connect: function(deviceId) {
        var deferred = $q.defer();

        $ionicPlatform.ready()
        .then(function() {
 
            ble.connect(deviceId,
                function(peripheral) {
                    connected = peripheral;
                    deferred.resolve(peripheral);
                },
                function(reason) {
                    deferred.reject(reason);
                }
            );
        });

        return deferred.promise;
    },

    write: function(device_id, service_uuid, characteristic_uuid, value) {
        var deferred = $q.defer();

        $ionicPlatform.ready()
        .then(function() {
 
            ble.write(device_id, service_uuid, characteristic_uuid, value, 
                function() {
                    deferred.resolve();
                },
                function(reason) {
                    deferred.reject(reason);
                }
            );
        })

        return deferred.promise;

    },

    read: function(device_id, service_uuid, characteristic_uuid) {
        var deferred = $q.defer();

        $ionicPlatform.ready()
        .then(function() {
 
            ble.write(device_id, service_uuid, characteristic_uuid, value, 
                function(value) {
                    deferred.resolve(value);
                },
                function(reason) {
                    deferred.reject(reason);
                }
            );
        });

        return deferred.promise;
    }

  };
});