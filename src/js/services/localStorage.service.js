(function() {
  'use strict';

  angular.module('diffr.services').service('LocalStorageService', LocalStorageService);

  LocalStorageService.$inject = ['$window'];

  function LocalStorageService($window) {

    // variables

    // methods
    this.set            = set;
    this.get            = get;
    this.setObject      = setObject;
    this.getObject      = getObject;
    this.isArrayDefined = isArrayDefined;

    // initiators



    function set(key, value) {
    	$window.localStorage[key] = value;
    }

    function get(key, defaultValue) {
    	return $window.localStorage[key] || defaultValue;
    }

    function setObject(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    }

    function getObject(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }

    function isArrayDefined(key) {
      if(typeof JSON.parse($window.localStorage[key])[0] !== 'undefined') {
        return true;
      } else {
        return false;
      }
    }

  }

})();
