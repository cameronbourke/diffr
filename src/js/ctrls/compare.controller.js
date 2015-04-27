(function() {
  'use strict';

  angular.module('diffr.controllers').controller('CompareCtrl', CompareCtrl);

  CompareCtrl.$inject = ['$scope', '$rootScope', 'LocalStorageService', 'FlickrService', 'StorageService'];

  function CompareCtrl($scope, $rootScope, LocalStorageService, FlickrService, StorageService) {
    var compare = this;

    // variables

    // methods
    compare.removeComparedPhoto = removeComparedPhoto;

    // initiators
    getComparedPhotosList();



    function getComparedPhotosList() {
      var compareUrls = LocalStorageService.getObject('comparedUrls');
      if(compareUrls[0] !== undefined) {
        compare.comparedPhotosList = compareUrls;
      } else {
        compare.comparedPhotosList = [];
      }
    }

    function removeComparedPhoto(url) {
      var compareArr = LocalStorageService.getObject('comparedUrls'),
      urlIndex       = compareArr.indexOf(url);
      compareArr.splice(urlIndex, 1);
      compare.comparedPhotosList = compareArr;
      LocalStorageService.setObject('comparedUrls', compareArr);
    }

    var test = ["https://farm8.staticflickr.com/7590/17241926602_e4833c4f8c_b.jpg"];
    test.splice(0, 1);
    console.log(test);

  }

})();
