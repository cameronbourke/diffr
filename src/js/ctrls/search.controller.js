(function() {
  'use strict';

  angular.module('diffr.controllers').controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$rootScope', 'LocalStorageService', 'FlickrService', 'StorageService'];

  function SearchCtrl($scope, $rootScope, LocalStorageService, FlickrService, StorageService) {
    var search = this;

    // variables
    search.modelOptions = {
      updateOn: 'default blur',
      debounce: {
        'default': 1 * 1000,
        'blur': 0
      }
    };
    search.recentSearches      = StorageService.getArray('recentSearches') || [];
    search.showRecentsDropdown = false;
    var initialLoad            = true;
    search.searchedText        = 'selfie';

    // methods
    search.getSearchedPhotos = getSearchedPhotos;
    search.updatePhotos      = updatePhotos;
    search.toggleRecents     = toggleRecents;

    // initiators
    getSearchedPhotos('selfie');



    function getSearchedPhotos(text) {
      if(!initialLoad) {
        search.searchedPhotos = text;
      }
      initialLoad = false;
      FlickrService.getSearchedPhotos(text).then(function(photos) {
        console.log(photos);
        search.searchedPhotosList = photos;
        search.searchedText = text;
        if(search.recentSearches.indexOf(text) === -1) {
          search.recentSearches.push(text);
        }
      });
    }

    function updatePhotos(newValue) {
      getSearchedPhotos(newValue);
    }

    function toggleRecents() {
      search.showRecentsDropdown = !search.showRecentsDropdown;
    }

  }

})();
