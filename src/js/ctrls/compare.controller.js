(function() {
  'use strict';

  angular.module('diffr.controllers').controller('CompareCtrl', CompareCtrl);

  CompareCtrl.$inject = ['$scope', '$rootScope', 'LocalStorageService', 'FlickrService', 'StorageService'];

  function CompareCtrl($scope, $rootScope, LocalStorageService, FlickrService, StorageService) {
    var compare = this;

    // variables
    var compareArr = LocalStorageService.getObject('comparedUrls');

    // methods
    compare.removeComparedPhoto = removeComparedPhoto;

    // initiators
    getComparedPhotosList();



    function getComparedPhotosList() {
      // need to know whether the user has photos saved or not
      if(LocalStorageService.isArrayDefined('comparedUrls')) {
        compare.comparedPhotosList = compareArr;
      } else {
        compare.comparedPhotosList = [];
      }
    }

    function removeComparedPhoto(url) {
      var urlIndex = compareArr.indexOf(url);
      compareArr.splice(urlIndex, 1);
      compare.comparedPhotosList = compareArr;
      // make sure to update LocalStorage after we've assigned the new array to scope
      LocalStorageService.setObject('comparedUrls', compareArr);
    }

  }

})();
