(function() {
  'use strict';

  angular.module('diffr.filters', []);

  function capitalize() {
    return function(input) {
      console.log(input);
      if(typeof input !== 'undefined') {
        return input.substring(0,1).toUpperCase() + input.substring(1);
      }
    };
  }

  angular
    .module('diffr.filters')
    .filter('capitalize', capitalize);

})();
