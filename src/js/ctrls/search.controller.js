(function() {
  'use strict';

  angular.module('diffr.controllers').controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$scope', '$rootScope', 'LocalStorageService', 'FlickrService', 'StorageService'];

  function SearchCtrl($scope, $rootScope, LocalStorageService, FlickrService, StorageService) {
    var search = this;

    // variables
    search.modelOptions = {
      // need to debounce the model from updating
      // so it only goes to flickr api when the user
      // is sure about what they are searching for
      updateOn: 'default blur',
      debounce: {
        'default': 1 * 1000,
        'blur': 0
      }
    };
    search.recentSearches      = [];
    search.showRecentsDropdown = false;
    search.searchedText        = 'selfie';
    var initialLoad            = true;
    var newArray;

    // methods
    search.getSearchedPhotos = getSearchedPhotos;
    search.updatePhotos      = updatePhotos;
    search.toggleRecents     = toggleRecents;
    search.loadMorePhotos    = loadMorePhotos;
    search.addPhotoToCompare = addPhotoToCompare;
    search.showCompareButton = showCompareButton;
    search.hasComparedPhotos = hasComparedPhotos;

    // initiators
    // initially loading 20 photos with the tag selfie
    getSearchedPhotos('selfie', 20);
    getComparedPhotosList();



    function getSearchedPhotos(text, amount) {
      if(!initialLoad) {
        search.searchedPhotos = text;
      }
      search.searchedText = text;
      initialLoad = false;
      search.searchedPhotosList = [];
      FlickrService.getSearchedPhotos(text, amount).then(function(photos) {
        search.searchedPhotosList = photos;
        // dontt want duplicates in the ng-repeat for recent searches
        if(search.recentSearches.indexOf(text) === -1) {
          search.recentSearches.push(text);
        }
      });
    }

    function loadMorePhotos(text, amount) {
      FlickrService.getSearchedPhotos(text, amount).then(function(photos) {
        // need to add each photo to the end of the searchedPhotosList array
        photos.forEach(function(element) {
          search.searchedPhotosList.push(element);
        });
      });
    }

    function updatePhotos(newValue) {
      // don't update the photos when the search bar is empty
      if(newValue !== '' || typeof newValue !== 'undefined' || !false) {
        getSearchedPhotos(newValue, 20);
        search.showRecentsDropdown = false;
      }
    }

    function toggleRecents() {
      search.showRecentsDropdown = !search.showRecentsDropdown;
    }

    function addPhotoToCompare(photo) {
      // need to construct the unique url for the photo
      var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
      if(newArray.indexOf(url) === -1) {
        newArray.push(url);
        LocalStorageService.setObject('comparedUrls', newArray);
      } else {
        console.log('already in comparison list');
      }
    }

    function getComparedPhotosList() {
      var compareUrls = LocalStorageService.getObject('comparedUrls');
      if(compareUrls[0] !== undefined) {
        newArray = compareUrls;
      } else {
        newArray = [];
      }
    }

    function showCompareButton(photo) {
      var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
      // if the photo is already saved, don't show the add to compare btn
      if(newArray.indexOf(url) === -1) {
        return true;
      } else {
        return false;
      }
    }

    function hasComparedPhotos() {
      // only pulse the compare photos nav button if there are photos saved
      if(typeof LocalStorageService.getObject('comparedUrls')[0] !== 'undefined') {
        return true;
      } else {
        return false;
      }
    }

  }

})();
