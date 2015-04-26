(function() {
  'use strict';

  angular.module('diffr.services').service('StorageService', StorageService);

  StorageService.$inject = [];

  function StorageService() {

    // variables
    var storageObject     = {};
    storageObject.objects = {};

    // methods
    this.set = set;
    this.get = get;

    // initiators



    function set(key, value) {
			objectsService.objects[key] = value;
		}

		function get(key) {
			return objectsService.objects[key];
		}

  }

})();
