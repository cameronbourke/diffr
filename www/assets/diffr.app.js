angular.module('diffr', [
  'ngAnimate',
  'ui.router',
  'diffr.controllers',
  'diffr.filters',
  'diffr.config',
  'diffr.directives',
  'diffr.services',
  'infinite-scroll'
]);

(function(){
  'use strict';

  angular.module('diffr.config', []);

  angular.module('diffr.config').config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('search', {
    url: "/search",
    templateUrl: "templates/search.html",
    controller: "SearchCtrl",
    controllerAs: "search",
  })

  .state('compare', {
    url: "/compare",
    templateUrl: "templates/compare.html",
    controller: "CompareCtrl",
    controllerAs: "compare",
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/search');
}

})();

(function() {
  'use strict';

  angular.module('diffr.controllers', []);

  angular.module('diffr.controllers').controller('AppCtrl', AppCtrl);

  AppCtrl.$inject = ['$scope', '$rootScope'];

  function AppCtrl($scope, $rootScope) {
    var app = this;

    // variables

    // methods

    // initiators


  }

})();

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
      if(LocalStorageService.isArrayDefined('comparedUrls')) {
        newArray = LocalStorageService.getObject('comparedUrls');
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
      if(LocalStorageService.isArrayDefined('comparedUrls')) {
        return true;
      } else {
        return false;
      }
    }

  }

})();

(function() {
  'use strict';

  angular.module('diffr.directives', []);

  // allows us to use the benefits of inline svg, without the clutter of the markup in our html
  function iconAddCompare() {
    return {
      restrict: 'E',
      template: [
      '<svg class="icon-add-photos" width="100%" height="100%" viewBox="-1 -1 31 25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
        "<title>Two photos stacked with an add icon in the corner</title>",
        "<desc>Lets the user add a new photo to their list of compared images</desc>",
        // target this class to change fill, stroke colour etc in the css
        "<g class='svg-compare-icons'>",
          "<g stroke-width='1'>",
            "<path d='M0.118149935,4.50963844 L11.8374394,0.802704286 L18.1785857,17.7202619 L6.45929629,21.427196 L0.118149935,4.50963844 L0.118149935,4.50963844 Z'></path>",
            "<path d='M18.0003708,0.243357633 L28.6245848,6.10760511 L18.5931005,21.44435 L7.96888653,15.5801025 L18.0003708,0.243357633 L18.0003708,0.243357633 Z'></path>",
          "</g>",
          "<g>",
            '<ellipse cx="5.54186573" cy="5.15083056" rx="5.54186573" ry="5.15083056"></ellipse>',
            '<path d="M5.18820719,4.80797342 L5.18820719,2.40797342 L5.89552426,2.40797342 L5.89552426,4.80797342 L8.37113402,4.80797342 L8.37113402,5.49368771 L5.89552426,5.49368771', 'L5.89552426,7.89368771', 'L5.18820719,7.89368771 L5.18820719,5.49368771 L2.71259744,5.49368771 L2.71259744,4.80797342 L5.18820719,4.80797342 Z"></path>',
          '</g>',
        '</g>',
      '</svg>'
      ].join('')
    };
  }

  angular
  .module('diffr.directives')
  .directive('iconAddCompare', iconAddCompare);

})();

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

(function() {
  'use strict';

  angular.module('diffr.services', []);

  angular.module('diffr.services').service('FlickrService', FlickrService);

  // need the inject method for minification
  FlickrService.$inject = ['$http', '$q'];

  function FlickrService($http, $q) {

    // variables
    var flickrKey = '52ebcfc572066983269bf5140708086d',
    flickrSecret  = 'e8d53a2ff70b1077';

    // methods
    this.getSearchedPhotos = getSearchedPhotos;

    // initiators



    function getSearchedPhotos(text, amount) {
      // need to use a promise becuase $http's success and error can be unreliable
      var defer = $q.defer();

      $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrKey + '&tags=' + text + '&per_page=' + amount + '&format=json&nojsoncallback=1')
      .success(function(data) {
        defer.resolve(data.photos.photo);
      })
      .error(function(error, status) {
        console.log(error);
        defer.reject(error);
      });

      return defer.promise;

    }


  }

})();

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
      var arr = JSON.parse($window.localStorage[key]);
      if(typeof arr[0] !== 'undefined') {
        return true;
      } else {
        return false;
      }
    }

  }

})();

(function() {
  'use strict';

  angular.module('diffr.services').service('StorageService', StorageService);

  StorageService.$inject = [];

  function StorageService() {

    // variables
    var storageObject      = {};
    storageObject.objects  = {};
    storageObject.arrays   = {};
    storageObject.strings  = {};

    // methods
    this.setObject     = setObject;
    this.getObject     = getObject;
    this.setArray      = setArray;
    this.getArray      = getArray;
    this.setString     = setString;
    this.getString     = getString;
    this.getAllStorage = getAllStorage;

    // initiators



    function setObject(key, value) {
      storageObject.objects[key] = value;
		}

		function getObject(key) {
			return storageObject.objects[key];
		}

    function setArray(key, value) {
      storageObject.arrays[key] = value;
    }

    function getArray(key) {
      return storageObject.arrays[key];
    }

    function setString(key, value) {
      storageObject.strings[key] = value;
    }

    function getString(key) {
      return storageObject.strings[key];
    }

    function getAllStorage() {
      return storageObject;
    }

  }

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiY3RybHMvY29tcGFyZS5jb250cm9sbGVyLmpzIiwiY3RybHMvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2RpcmVjdGl2ZXMuanMiLCJmaWx0ZXJzL2ZpbHRlcnMuanMiLCJzZXJ2aWNlcy9mbGlja3Iuc2VydmljZS5qcyIsInNlcnZpY2VzL2xvY2FsU3RvcmFnZS5zZXJ2aWNlLmpzIiwic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkaWZmci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnZGlmZnInLCBbXG4gICduZ0FuaW1hdGUnLFxuICAndWkucm91dGVyJyxcbiAgJ2RpZmZyLmNvbnRyb2xsZXJzJyxcbiAgJ2RpZmZyLmZpbHRlcnMnLFxuICAnZGlmZnIuY29uZmlnJyxcbiAgJ2RpZmZyLmRpcmVjdGl2ZXMnLFxuICAnZGlmZnIuc2VydmljZXMnLFxuICAnaW5maW5pdGUtc2Nyb2xsJ1xuXSk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb25maWcnLCBbXSk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbmZpZycpLmNvbmZpZyhyb3V0ZUNvbmZpZyk7XG5cbiAgcm91dGVDb25maWcuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJ107XG5cbiAgZnVuY3Rpb24gcm91dGVDb25maWcoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgJHN0YXRlUHJvdmlkZXJcblxuICAuc3RhdGUoJ3NlYXJjaCcsIHtcbiAgICB1cmw6IFwiL3NlYXJjaFwiLFxuICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9zZWFyY2guaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiU2VhcmNoQ3RybFwiLFxuICAgIGNvbnRyb2xsZXJBczogXCJzZWFyY2hcIixcbiAgfSlcblxuICAuc3RhdGUoJ2NvbXBhcmUnLCB7XG4gICAgdXJsOiBcIi9jb21wYXJlXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2NvbXBhcmUuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFyZUN0cmxcIixcbiAgICBjb250cm9sbGVyQXM6IFwiY29tcGFyZVwiLFxuICB9KTtcblxuICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2VhcmNoJyk7XG59XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnLCBbXSk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQXBwQ3RybCcsIEFwcEN0cmwpO1xuXG4gIEFwcEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnXTtcblxuICBmdW5jdGlvbiBBcHBDdHJsKCRzY29wZSwgJHJvb3RTY29wZSkge1xuICAgIHZhciBhcHAgPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb21wYXJlQ3RybCcsIENvbXBhcmVDdHJsKTtcblxuICBDb21wYXJlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdMb2NhbFN0b3JhZ2VTZXJ2aWNlJywgJ0ZsaWNrclNlcnZpY2UnLCAnU3RvcmFnZVNlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBDb21wYXJlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsIExvY2FsU3RvcmFnZVNlcnZpY2UsIEZsaWNrclNlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgdmFyIGNvbXBhcmUgPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIGNvbXBhcmVBcnIgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldE9iamVjdCgnY29tcGFyZWRVcmxzJyk7XG5cbiAgICAvLyBtZXRob2RzXG4gICAgY29tcGFyZS5yZW1vdmVDb21wYXJlZFBob3RvID0gcmVtb3ZlQ29tcGFyZWRQaG90bztcblxuICAgIC8vIGluaXRpYXRvcnNcbiAgICBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKTtcblxuXG5cbiAgICBmdW5jdGlvbiBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKSB7XG4gICAgICAvLyBuZWVkIHRvIGtub3cgd2hldGhlciB0aGUgdXNlciBoYXMgcGhvdG9zIHNhdmVkIG9yIG5vdFxuICAgICAgaWYoTG9jYWxTdG9yYWdlU2VydmljZS5pc0FycmF5RGVmaW5lZCgnY29tcGFyZWRVcmxzJykpIHtcbiAgICAgICAgY29tcGFyZS5jb21wYXJlZFBob3Rvc0xpc3QgPSBjb21wYXJlQXJyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGFyZS5jb21wYXJlZFBob3Rvc0xpc3QgPSBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVDb21wYXJlZFBob3RvKHVybCkge1xuICAgICAgdmFyIHVybEluZGV4ID0gY29tcGFyZUFyci5pbmRleE9mKHVybCk7XG4gICAgICBjb21wYXJlQXJyLnNwbGljZSh1cmxJbmRleCwgMSk7XG4gICAgICBjb21wYXJlLmNvbXBhcmVkUGhvdG9zTGlzdCA9IGNvbXBhcmVBcnI7XG4gICAgICAvLyBtYWtlIHN1cmUgdG8gdXBkYXRlIExvY2FsU3RvcmFnZSBhZnRlciB3ZSd2ZSBhc3NpZ25lZCB0aGUgbmV3IGFycmF5IHRvIHNjb3BlXG4gICAgICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldE9iamVjdCgnY29tcGFyZWRVcmxzJywgY29tcGFyZUFycik7XG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlYXJjaEN0cmwnLCBTZWFyY2hDdHJsKTtcblxuICBTZWFyY2hDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnRmxpY2tyU2VydmljZScsICdTdG9yYWdlU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIFNlYXJjaEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlLCBGbGlja3JTZXJ2aWNlLCBTdG9yYWdlU2VydmljZSkge1xuICAgIHZhciBzZWFyY2ggPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgc2VhcmNoLm1vZGVsT3B0aW9ucyA9IHtcbiAgICAgIC8vIG5lZWQgdG8gZGVib3VuY2UgdGhlIG1vZGVsIGZyb20gdXBkYXRpbmdcbiAgICAgIC8vIHNvIGl0IG9ubHkgZ29lcyB0byBmbGlja3IgYXBpIHdoZW4gdGhlIHVzZXJcbiAgICAgIC8vIGlzIHN1cmUgYWJvdXQgd2hhdCB0aGV5IGFyZSBzZWFyY2hpbmcgZm9yXG4gICAgICB1cGRhdGVPbjogJ2RlZmF1bHQgYmx1cicsXG4gICAgICBkZWJvdW5jZToge1xuICAgICAgICAnZGVmYXVsdCc6IDEgKiAxMDAwLFxuICAgICAgICAnYmx1cic6IDBcbiAgICAgIH1cbiAgICB9O1xuICAgIHNlYXJjaC5yZWNlbnRTZWFyY2hlcyAgICAgID0gW107XG4gICAgc2VhcmNoLnNob3dSZWNlbnRzRHJvcGRvd24gPSBmYWxzZTtcbiAgICBzZWFyY2guc2VhcmNoZWRUZXh0ICAgICAgICA9ICdzZWxmaWUnO1xuICAgIHZhciBpbml0aWFsTG9hZCAgICAgICAgICAgID0gdHJ1ZTtcbiAgICB2YXIgbmV3QXJyYXk7XG5cbiAgICAvLyBtZXRob2RzXG4gICAgc2VhcmNoLmdldFNlYXJjaGVkUGhvdG9zID0gZ2V0U2VhcmNoZWRQaG90b3M7XG4gICAgc2VhcmNoLnVwZGF0ZVBob3RvcyAgICAgID0gdXBkYXRlUGhvdG9zO1xuICAgIHNlYXJjaC50b2dnbGVSZWNlbnRzICAgICA9IHRvZ2dsZVJlY2VudHM7XG4gICAgc2VhcmNoLmxvYWRNb3JlUGhvdG9zICAgID0gbG9hZE1vcmVQaG90b3M7XG4gICAgc2VhcmNoLmFkZFBob3RvVG9Db21wYXJlID0gYWRkUGhvdG9Ub0NvbXBhcmU7XG4gICAgc2VhcmNoLnNob3dDb21wYXJlQnV0dG9uID0gc2hvd0NvbXBhcmVCdXR0b247XG4gICAgc2VhcmNoLmhhc0NvbXBhcmVkUGhvdG9zID0gaGFzQ29tcGFyZWRQaG90b3M7XG5cbiAgICAvLyBpbml0aWF0b3JzXG4gICAgLy8gaW5pdGlhbGx5IGxvYWRpbmcgMjAgcGhvdG9zIHdpdGggdGhlIHRhZyBzZWxmaWVcbiAgICBnZXRTZWFyY2hlZFBob3Rvcygnc2VsZmllJywgMjApO1xuICAgIGdldENvbXBhcmVkUGhvdG9zTGlzdCgpO1xuXG5cblxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkge1xuICAgICAgaWYoIWluaXRpYWxMb2FkKSB7XG4gICAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3RvcyA9IHRleHQ7XG4gICAgICB9XG4gICAgICBzZWFyY2guc2VhcmNoZWRUZXh0ID0gdGV4dDtcbiAgICAgIGluaXRpYWxMb2FkID0gZmFsc2U7XG4gICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0ID0gW107XG4gICAgICBGbGlja3JTZXJ2aWNlLmdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkudGhlbihmdW5jdGlvbihwaG90b3MpIHtcbiAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zTGlzdCA9IHBob3RvcztcbiAgICAgICAgLy8gZG9udHQgd2FudCBkdXBsaWNhdGVzIGluIHRoZSBuZy1yZXBlYXQgZm9yIHJlY2VudCBzZWFyY2hlc1xuICAgICAgICBpZihzZWFyY2gucmVjZW50U2VhcmNoZXMuaW5kZXhPZih0ZXh0KSA9PT0gLTEpIHtcbiAgICAgICAgICBzZWFyY2gucmVjZW50U2VhcmNoZXMucHVzaCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZE1vcmVQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICBGbGlja3JTZXJ2aWNlLmdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkudGhlbihmdW5jdGlvbihwaG90b3MpIHtcbiAgICAgICAgLy8gbmVlZCB0byBhZGQgZWFjaCBwaG90byB0byB0aGUgZW5kIG9mIHRoZSBzZWFyY2hlZFBob3Rvc0xpc3QgYXJyYXlcbiAgICAgICAgcGhvdG9zLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVQaG90b3MobmV3VmFsdWUpIHtcbiAgICAgIC8vIGRvbid0IHVwZGF0ZSB0aGUgcGhvdG9zIHdoZW4gdGhlIHNlYXJjaCBiYXIgaXMgZW1wdHlcbiAgICAgIGlmKG5ld1ZhbHVlICE9PSAnJyB8fCB0eXBlb2YgbmV3VmFsdWUgIT09ICd1bmRlZmluZWQnIHx8ICFmYWxzZSkge1xuICAgICAgICBnZXRTZWFyY2hlZFBob3RvcyhuZXdWYWx1ZSwgMjApO1xuICAgICAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVJlY2VudHMoKSB7XG4gICAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9ICFzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93bjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRQaG90b1RvQ29tcGFyZShwaG90bykge1xuICAgICAgLy8gbmVlZCB0byBjb25zdHJ1Y3QgdGhlIHVuaXF1ZSB1cmwgZm9yIHRoZSBwaG90b1xuICAgICAgdmFyIHVybCA9ICdodHRwczovL2Zhcm0nICsgcGhvdG8uZmFybSArICcuc3RhdGljZmxpY2tyLmNvbS8nICsgcGhvdG8uc2VydmVyICsgJy8nICsgcGhvdG8uaWQgKyAnXycgKyBwaG90by5zZWNyZXQgKyAnX2IuanBnJztcbiAgICAgIGlmKG5ld0FycmF5LmluZGV4T2YodXJsKSA9PT0gLTEpIHtcbiAgICAgICAgbmV3QXJyYXkucHVzaCh1cmwpO1xuICAgICAgICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldE9iamVjdCgnY29tcGFyZWRVcmxzJywgbmV3QXJyYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FscmVhZHkgaW4gY29tcGFyaXNvbiBsaXN0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q29tcGFyZWRQaG90b3NMaXN0KCkge1xuICAgICAgaWYoTG9jYWxTdG9yYWdlU2VydmljZS5pc0FycmF5RGVmaW5lZCgnY29tcGFyZWRVcmxzJykpIHtcbiAgICAgICAgbmV3QXJyYXkgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldE9iamVjdCgnY29tcGFyZWRVcmxzJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdBcnJheSA9IFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dDb21wYXJlQnV0dG9uKHBob3RvKSB7XG4gICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vZmFybScgKyBwaG90by5mYXJtICsgJy5zdGF0aWNmbGlja3IuY29tLycgKyBwaG90by5zZXJ2ZXIgKyAnLycgKyBwaG90by5pZCArICdfJyArIHBob3RvLnNlY3JldCArICdfYi5qcGcnO1xuICAgICAgLy8gaWYgdGhlIHBob3RvIGlzIGFscmVhZHkgc2F2ZWQsIGRvbid0IHNob3cgdGhlIGFkZCB0byBjb21wYXJlIGJ0blxuICAgICAgaWYobmV3QXJyYXkuaW5kZXhPZih1cmwpID09PSAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNDb21wYXJlZFBob3RvcygpIHtcbiAgICAgIC8vIG9ubHkgcHVsc2UgdGhlIGNvbXBhcmUgcGhvdG9zIG5hdiBidXR0b24gaWYgdGhlcmUgYXJlIHBob3RvcyBzYXZlZFxuICAgICAgaWYoTG9jYWxTdG9yYWdlU2VydmljZS5pc0FycmF5RGVmaW5lZCgnY29tcGFyZWRVcmxzJykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5kaXJlY3RpdmVzJywgW10pO1xuXG4gIC8vIGFsbG93cyB1cyB0byB1c2UgdGhlIGJlbmVmaXRzIG9mIGlubGluZSBzdmcsIHdpdGhvdXQgdGhlIGNsdXR0ZXIgb2YgdGhlIG1hcmt1cCBpbiBvdXIgaHRtbFxuICBmdW5jdGlvbiBpY29uQWRkQ29tcGFyZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHRlbXBsYXRlOiBbXG4gICAgICAnPHN2ZyBjbGFzcz1cImljb24tYWRkLXBob3Rvc1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiLTEgLTEgMzEgMjVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCI+JyxcbiAgICAgICAgXCI8dGl0bGU+VHdvIHBob3RvcyBzdGFja2VkIHdpdGggYW4gYWRkIGljb24gaW4gdGhlIGNvcm5lcjwvdGl0bGU+XCIsXG4gICAgICAgIFwiPGRlc2M+TGV0cyB0aGUgdXNlciBhZGQgYSBuZXcgcGhvdG8gdG8gdGhlaXIgbGlzdCBvZiBjb21wYXJlZCBpbWFnZXM8L2Rlc2M+XCIsXG4gICAgICAgIC8vIHRhcmdldCB0aGlzIGNsYXNzIHRvIGNoYW5nZSBmaWxsLCBzdHJva2UgY29sb3VyIGV0YyBpbiB0aGUgY3NzXG4gICAgICAgIFwiPGcgY2xhc3M9J3N2Zy1jb21wYXJlLWljb25zJz5cIixcbiAgICAgICAgICBcIjxnIHN0cm9rZS13aWR0aD0nMSc+XCIsXG4gICAgICAgICAgICBcIjxwYXRoIGQ9J00wLjExODE0OTkzNSw0LjUwOTYzODQ0IEwxMS44Mzc0Mzk0LDAuODAyNzA0Mjg2IEwxOC4xNzg1ODU3LDE3LjcyMDI2MTkgTDYuNDU5Mjk2MjksMjEuNDI3MTk2IEwwLjExODE0OTkzNSw0LjUwOTYzODQ0IEwwLjExODE0OTkzNSw0LjUwOTYzODQ0IFonPjwvcGF0aD5cIixcbiAgICAgICAgICAgIFwiPHBhdGggZD0nTTE4LjAwMDM3MDgsMC4yNDMzNTc2MzMgTDI4LjYyNDU4NDgsNi4xMDc2MDUxMSBMMTguNTkzMTAwNSwyMS40NDQzNSBMNy45Njg4ODY1MywxNS41ODAxMDI1IEwxOC4wMDAzNzA4LDAuMjQzMzU3NjMzIEwxOC4wMDAzNzA4LDAuMjQzMzU3NjMzIFonPjwvcGF0aD5cIixcbiAgICAgICAgICBcIjwvZz5cIixcbiAgICAgICAgICBcIjxnPlwiLFxuICAgICAgICAgICAgJzxlbGxpcHNlIGN4PVwiNS41NDE4NjU3M1wiIGN5PVwiNS4xNTA4MzA1NlwiIHJ4PVwiNS41NDE4NjU3M1wiIHJ5PVwiNS4xNTA4MzA1NlwiPjwvZWxsaXBzZT4nLFxuICAgICAgICAgICAgJzxwYXRoIGQ9XCJNNS4xODgyMDcxOSw0LjgwNzk3MzQyIEw1LjE4ODIwNzE5LDIuNDA3OTczNDIgTDUuODk1NTI0MjYsMi40MDc5NzM0MiBMNS44OTU1MjQyNiw0LjgwNzk3MzQyIEw4LjM3MTEzNDAyLDQuODA3OTczNDIgTDguMzcxMTM0MDIsNS40OTM2ODc3MSBMNS44OTU1MjQyNiw1LjQ5MzY4NzcxJywgJ0w1Ljg5NTUyNDI2LDcuODkzNjg3NzEnLCAnTDUuMTg4MjA3MTksNy44OTM2ODc3MSBMNS4xODgyMDcxOSw1LjQ5MzY4NzcxIEwyLjcxMjU5NzQ0LDUuNDkzNjg3NzEgTDIuNzEyNTk3NDQsNC44MDc5NzM0MiBMNS4xODgyMDcxOSw0LjgwNzk3MzQyIFpcIj48L3BhdGg+JyxcbiAgICAgICAgICAnPC9nPicsXG4gICAgICAgICc8L2c+JyxcbiAgICAgICc8L3N2Zz4nXG4gICAgICBdLmpvaW4oJycpXG4gICAgfTtcbiAgfVxuXG4gIGFuZ3VsYXJcbiAgLm1vZHVsZSgnZGlmZnIuZGlyZWN0aXZlcycpXG4gIC5kaXJlY3RpdmUoJ2ljb25BZGRDb21wYXJlJywgaWNvbkFkZENvbXBhcmUpO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmZpbHRlcnMnLCBbXSk7XG5cbiAgZnVuY3Rpb24gY2FwaXRhbGl6ZSgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgIGNvbnNvbGUubG9nKGlucHV0KTtcbiAgICAgIGlmKHR5cGVvZiBpbnB1dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0LnN1YnN0cmluZygwLDEpLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdkaWZmci5maWx0ZXJzJylcbiAgICAuZmlsdGVyKCdjYXBpdGFsaXplJywgY2FwaXRhbGl6ZSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnLCBbXSk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnRmxpY2tyU2VydmljZScsIEZsaWNrclNlcnZpY2UpO1xuXG4gIC8vIG5lZWQgdGhlIGluamVjdCBtZXRob2QgZm9yIG1pbmlmaWNhdGlvblxuICBGbGlja3JTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRxJ107XG5cbiAgZnVuY3Rpb24gRmxpY2tyU2VydmljZSgkaHR0cCwgJHEpIHtcblxuICAgIC8vIHZhcmlhYmxlc1xuICAgIHZhciBmbGlja3JLZXkgPSAnNTJlYmNmYzU3MjA2Njk4MzI2OWJmNTE0MDcwODA4NmQnLFxuICAgIGZsaWNrclNlY3JldCAgPSAnZThkNTNhMmZmNzBiMTA3Nyc7XG5cbiAgICAvLyBtZXRob2RzXG4gICAgdGhpcy5nZXRTZWFyY2hlZFBob3RvcyA9IGdldFNlYXJjaGVkUGhvdG9zO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkge1xuICAgICAgLy8gbmVlZCB0byB1c2UgYSBwcm9taXNlIGJlY3Vhc2UgJGh0dHAncyBzdWNjZXNzIGFuZCBlcnJvciBjYW4gYmUgdW5yZWxpYWJsZVxuICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcblxuICAgICAgJGh0dHAuZ2V0KCdodHRwczovL2FwaS5mbGlja3IuY29tL3NlcnZpY2VzL3Jlc3QvP21ldGhvZD1mbGlja3IucGhvdG9zLnNlYXJjaCZhcGlfa2V5PScgKyBmbGlja3JLZXkgKyAnJnRhZ3M9JyArIHRleHQgKyAnJnBlcl9wYWdlPScgKyBhbW91bnQgKyAnJmZvcm1hdD1qc29uJm5vanNvbmNhbGxiYWNrPTEnKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBkZWZlci5yZXNvbHZlKGRhdGEucGhvdG9zLnBob3RvKTtcbiAgICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IsIHN0YXR1cykge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIGRlZmVyLnJlamVjdChlcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG5cbiAgICB9XG5cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdMb2NhbFN0b3JhZ2VTZXJ2aWNlJywgTG9jYWxTdG9yYWdlU2VydmljZSk7XG5cbiAgTG9jYWxTdG9yYWdlU2VydmljZS4kaW5qZWN0ID0gWyckd2luZG93J107XG5cbiAgZnVuY3Rpb24gTG9jYWxTdG9yYWdlU2VydmljZSgkd2luZG93KSB7XG5cbiAgICAvLyB2YXJpYWJsZXNcblxuICAgIC8vIG1ldGhvZHNcbiAgICB0aGlzLnNldCAgICAgICAgICAgID0gc2V0O1xuICAgIHRoaXMuZ2V0ICAgICAgICAgICAgPSBnZXQ7XG4gICAgdGhpcy5zZXRPYmplY3QgICAgICA9IHNldE9iamVjdDtcbiAgICB0aGlzLmdldE9iamVjdCAgICAgID0gZ2V0T2JqZWN0O1xuICAgIHRoaXMuaXNBcnJheURlZmluZWQgPSBpc0FycmF5RGVmaW5lZDtcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG5cbiAgICBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIFx0JHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldChrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIFx0cmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9iamVjdChrZXksIHZhbHVlKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9iamVjdChrZXkpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgJ3t9Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBcnJheURlZmluZWQoa2V5KSB7XG4gICAgICB2YXIgYXJyID0gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldKTtcbiAgICAgIGlmKHR5cGVvZiBhcnJbMF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdTdG9yYWdlU2VydmljZScsIFN0b3JhZ2VTZXJ2aWNlKTtcblxuICBTdG9yYWdlU2VydmljZS4kaW5qZWN0ID0gW107XG5cbiAgZnVuY3Rpb24gU3RvcmFnZVNlcnZpY2UoKSB7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICB2YXIgc3RvcmFnZU9iamVjdCAgICAgID0ge307XG4gICAgc3RvcmFnZU9iamVjdC5vYmplY3RzICA9IHt9O1xuICAgIHN0b3JhZ2VPYmplY3QuYXJyYXlzICAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0LnN0cmluZ3MgID0ge307XG5cbiAgICAvLyBtZXRob2RzXG4gICAgdGhpcy5zZXRPYmplY3QgICAgID0gc2V0T2JqZWN0O1xuICAgIHRoaXMuZ2V0T2JqZWN0ICAgICA9IGdldE9iamVjdDtcbiAgICB0aGlzLnNldEFycmF5ICAgICAgPSBzZXRBcnJheTtcbiAgICB0aGlzLmdldEFycmF5ICAgICAgPSBnZXRBcnJheTtcbiAgICB0aGlzLnNldFN0cmluZyAgICAgPSBzZXRTdHJpbmc7XG4gICAgdGhpcy5nZXRTdHJpbmcgICAgID0gZ2V0U3RyaW5nO1xuICAgIHRoaXMuZ2V0QWxsU3RvcmFnZSA9IGdldEFsbFN0b3JhZ2U7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gc2V0T2JqZWN0KGtleSwgdmFsdWUpIHtcbiAgICAgIHN0b3JhZ2VPYmplY3Qub2JqZWN0c1trZXldID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0T2JqZWN0KGtleSkge1xuXHRcdFx0cmV0dXJuIHN0b3JhZ2VPYmplY3Qub2JqZWN0c1trZXldO1xuXHRcdH1cblxuICAgIGZ1bmN0aW9uIHNldEFycmF5KGtleSwgdmFsdWUpIHtcbiAgICAgIHN0b3JhZ2VPYmplY3QuYXJyYXlzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBcnJheShrZXkpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0LmFycmF5c1trZXldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFN0cmluZyhrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0LnN0cmluZ3Nba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0cmluZyhrZXkpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0LnN0cmluZ3Nba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBbGxTdG9yYWdlKCkge1xuICAgICAgcmV0dXJuIHN0b3JhZ2VPYmplY3Q7XG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==