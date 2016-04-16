// Underscore (_)
angular.module('ngWrappers').factory("d3", function( $window ) {
        // Get a local handle on the global lodash reference.
        var d3 = $window.d3;

        // Delete the global reference to make sure
        // that no one on the team gets lazy and tried to reference the library
        // without injecting it. It's an easy mistake to make, and one that won't
        // throw an error (since the core library is globally accessible).
        delete( $window.d3 );

   		// Return the [formerly global] reference so that it can be injected
        // into other aspects of the AngularJS application.
        return( d3 );
    }
);