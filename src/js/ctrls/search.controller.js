(function() {
  'use strict';

  angular.module('diffr.controllers').controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$rootScope', 'LocalStorageService', 'FlickrService'];

  function SearchCtrl($scope, $rootScope, LocalStorageService, FlickrService) {
    var search = this;

    // variables

    // methods
    search.getSearchedPhotos = getSearchedPhotos;

    // initiators
    getSearchedPhotos('dogs');


    function getSearchedPhotos(text) {
      FlickrService.getSearchedPhotos(text).then(function(photos) {
        console.log(photos);
        search.searchedPhotosList = photos;
      });
    }

  }

})();
