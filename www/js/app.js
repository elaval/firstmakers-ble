// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ble101', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // just checking if the BLE plugin works
    // ble.isEnabled(
    //     function() {
    //         console.log("Bluetooth is enabled");
    //     },
    //     function() {
    //         console.log("Bluetooth is *not* enabled");
    //         alert("Bluetooth is *not* enabled");
    //     }
    // );

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  // setup an abstract state for the tabs directive
  .state('ble101', {
    url: "/ble101",
    templateUrl: "view-list/list.html",
    controller: 'BLECtrl as controller'
  })
  
  // setup an abstract state for the tabs directive
  .state('ble101-detail', {
    url: "/ble101-detail/:deviceId",
    templateUrl: 'view-detail/detail.html',
    controller: 'BLEDetailCtrl as controller'
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/ble101');

});
