(function() {
  'use strict';

  angular.module('diffr.controllers').controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$rootScope', 'LocalStorageService', 'FlickrService'];

  function SearchCtrl($scope, $rootScope, LocalStorageService, FlickrService) {
    var search = this;

    // variables
    search.modelOptions = {
      updateOn: 'default blur',
      debounce: {
        'default': 1 * 1000,
        'blur': 0
      }
    };
    search.searchedText = 'seflie';

    // methods
    search.getSearchedPhotos = getSearchedPhotos;
    search.updatePhotos      = updatePhotos;

    // initiators
    getSearchedPhotos('selfie');


    function getSearchedPhotos(text) {
      FlickrService.getSearchedPhotos(text).then(function(photos) {
        console.log(photos);
        search.searchedPhotosList = photos;
        search.searchedText = text;
      });
    }

    function updatePhotos(newValue) {
      getSearchedPhotos(newValue);
    }

  }

})();
