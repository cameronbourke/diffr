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

angular.module('diffr.services', []);
angular.module('diffr.controllers', []);

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
      updateOn: 'default blur',
      debounce: {
        'default': 1 * 1000,
        'blur': 0
      }
    };
    search.recentSearches      = StorageService.getArray('recentSearches') || [];
    search.showRecentsDropdown = false;
    var initialLoad            = true;
    var newArray;
    search.searchedText        = 'selfie';

    // methods
    search.getSearchedPhotos = getSearchedPhotos;
    search.updatePhotos      = updatePhotos;
    search.toggleRecents     = toggleRecents;
    search.loadMorePhotos    = loadMorePhotos;
    search.addPhotoToCompare = addPhotoToCompare;
    search.showCompareButton = showCompareButton;
    search.hasComparedPhotos = hasComparedPhotos;

    // initiators
    getSearchedPhotos('selfie', 20);
    getComparedPhotosList();

    search.suggestedTags = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie", "celine", "brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred", "gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];



    function getSearchedPhotos(text, amount) {
      if(!initialLoad) {
        search.searchedPhotos = text;
      }
      search.searchedText = text;
      initialLoad = false;
      search.searchedPhotosList = [];
      FlickrService.getSearchedPhotos(text, amount).then(function(photos) {
        search.searchedPhotosList = photos;
        if(search.recentSearches.indexOf(text) === -1) {
          search.recentSearches.push(text);
        }
      });
    }

    function loadMorePhotos(text, amount) {
      FlickrService.getSearchedPhotos(text, amount).then(function(photos) {
        console.log(photos);
        photos.forEach(function(element) {
          search.searchedPhotosList.push(element);
        });
      });
    }

    function updatePhotos(newValue) {
      console.log(newValue);
      if(newValue !== '' || typeof newValue !== 'undefined' || !false) {
        getSearchedPhotos(newValue, 20);
        search.showRecentsDropdown = false;
      }
    }

    function toggleRecents() {
      search.showRecentsDropdown = !search.showRecentsDropdown;
    }

    function addPhotoToCompare(photo) {
      var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
      if(newArray.indexOf(url) === -1) {
        console.log(newArray);
        newArray.push(url);
        console.log(newArray);
        LocalStorageService.setObject('comparedUrls', newArray);
      } else {
        console.log('already in comparison list');
      }
    }

    function getComparedPhotosList() {
      var compareUrls = LocalStorageService.getObject('comparedUrls');
      console.log(compareUrls[0] !== undefined);
      if(compareUrls[0] !== undefined) {
        newArray = compareUrls;
      } else {
        newArray = [];
      }
    }

    function showCompareButton(photo) {
      var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
      if(newArray.indexOf(url) === -1) {
        return true;
      } else {
        return false;
      }
    }

    function hasComparedPhotos() {
      if(typeof LocalStorageService.getObject('comparedUrls')[0] !== 'undefined') {
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

  function iconAddCompare() {
    return {
      restrict: 'E',
      template: [
      '<svg class="icon-add-photos" width="100%" height="100%" viewBox="-1 -1 31 25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
        "<title>Two photos stacked with an add icon in the corner</title>",
        "<desc>Lets the user add a new photo to their list of compared images</desc>",
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

  angular.module('diffr.services').service('FlickrService', FlickrService);

  FlickrService.$inject = ['$http', '$q'];

  function FlickrService($http, $q) {

    // variables
    var flickrKey = '52ebcfc572066983269bf5140708086d',
    flickrSecret  = 'e8d53a2ff70b1077';

    // methods
    this.getSearchedPhotos = getSearchedPhotos;

    // initiators



    function getSearchedPhotos(text, amount) {
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
    this.set = set;
    this.get = get;
    this.setObject = setObject;
    this.getObject = getObject;

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiY3RybHMvY29tcGFyZS5jb250cm9sbGVyLmpzIiwiY3RybHMvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2RpcmVjdGl2ZXMuanMiLCJmaWx0ZXJzL2ZpbHRlcnMuanMiLCJzZXJ2aWNlcy9mbGlja3Iuc2VydmljZS5qcyIsInNlcnZpY2VzL2xvY2FsU3RvcmFnZS5zZXJ2aWNlLmpzIiwic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkaWZmci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnZGlmZnInLCBbXG4gICduZ0FuaW1hdGUnLFxuICAndWkucm91dGVyJyxcbiAgJ2RpZmZyLmNvbnRyb2xsZXJzJyxcbiAgJ2RpZmZyLmZpbHRlcnMnLFxuICAnZGlmZnIuY29uZmlnJyxcbiAgJ2RpZmZyLmRpcmVjdGl2ZXMnLFxuICAnZGlmZnIuc2VydmljZXMnLFxuICAnaW5maW5pdGUtc2Nyb2xsJ1xuXSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycsIFtdKTtcbiIsIihmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbmZpZycsIFtdKTtcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29uZmlnJykuY29uZmlnKHJvdXRlQ29uZmlnKTtcblxuICByb3V0ZUNvbmZpZy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInXTtcblxuICBmdW5jdGlvbiByb3V0ZUNvbmZpZygkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgLy8gSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gIC8vIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gIC8vIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gIC8vIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAkc3RhdGVQcm92aWRlclxuXG4gIC5zdGF0ZSgnc2VhcmNoJywge1xuICAgIHVybDogXCIvc2VhcmNoXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3NlYXJjaC5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJTZWFyY2hDdHJsXCIsXG4gICAgY29udHJvbGxlckFzOiBcInNlYXJjaFwiLFxuICB9KVxuXG4gIC5zdGF0ZSgnY29tcGFyZScsIHtcbiAgICB1cmw6IFwiL2NvbXBhcmVcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvY29tcGFyZS5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJDb21wYXJlQ3RybFwiLFxuICAgIGNvbnRyb2xsZXJBczogXCJjb21wYXJlXCIsXG4gIH0pO1xuXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9zZWFyY2gnKTtcbn1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FwcEN0cmwnLCBBcHBDdHJsKTtcblxuICBBcHBDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJ107XG5cbiAgZnVuY3Rpb24gQXBwQ3RybCgkc2NvcGUsICRyb290U2NvcGUpIHtcbiAgICB2YXIgYXBwID0gdGhpcztcblxuICAgIC8vIHZhcmlhYmxlc1xuXG4gICAgLy8gbWV0aG9kc1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ29tcGFyZUN0cmwnLCBDb21wYXJlQ3RybCk7XG5cbiAgQ29tcGFyZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnTG9jYWxTdG9yYWdlU2VydmljZScsICdGbGlja3JTZXJ2aWNlJywgJ1N0b3JhZ2VTZXJ2aWNlJ107XG5cbiAgZnVuY3Rpb24gQ29tcGFyZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlLCBGbGlja3JTZXJ2aWNlLCBTdG9yYWdlU2VydmljZSkge1xuICAgIHZhciBjb21wYXJlID0gdGhpcztcblxuICAgIC8vIHZhcmlhYmxlc1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIGNvbXBhcmUucmVtb3ZlQ29tcGFyZWRQaG90byA9IHJlbW92ZUNvbXBhcmVkUGhvdG87XG5cbiAgICAvLyBpbml0aWF0b3JzXG4gICAgZ2V0Q29tcGFyZWRQaG90b3NMaXN0KCk7XG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0Q29tcGFyZWRQaG90b3NMaXN0KCkge1xuICAgICAgdmFyIGNvbXBhcmVVcmxzID0gTG9jYWxTdG9yYWdlU2VydmljZS5nZXRPYmplY3QoJ2NvbXBhcmVkVXJscycpO1xuICAgICAgaWYoY29tcGFyZVVybHNbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb21wYXJlLmNvbXBhcmVkUGhvdG9zTGlzdCA9IGNvbXBhcmVVcmxzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGFyZS5jb21wYXJlZFBob3Rvc0xpc3QgPSBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVDb21wYXJlZFBob3RvKHVybCkge1xuICAgICAgdmFyIGNvbXBhcmVBcnIgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldE9iamVjdCgnY29tcGFyZWRVcmxzJyksXG4gICAgICB1cmxJbmRleCAgICAgICA9IGNvbXBhcmVBcnIuaW5kZXhPZih1cmwpO1xuICAgICAgY29tcGFyZUFyci5zcGxpY2UodXJsSW5kZXgsIDEpO1xuICAgICAgY29tcGFyZS5jb21wYXJlZFBob3Rvc0xpc3QgPSBjb21wYXJlQXJyO1xuICAgICAgTG9jYWxTdG9yYWdlU2VydmljZS5zZXRPYmplY3QoJ2NvbXBhcmVkVXJscycsIGNvbXBhcmVBcnIpO1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWFyY2hDdHJsJywgU2VhcmNoQ3RybCk7XG5cbiAgU2VhcmNoQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdMb2NhbFN0b3JhZ2VTZXJ2aWNlJywgJ0ZsaWNrclNlcnZpY2UnLCAnU3RvcmFnZVNlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBTZWFyY2hDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgTG9jYWxTdG9yYWdlU2VydmljZSwgRmxpY2tyU2VydmljZSwgU3RvcmFnZVNlcnZpY2UpIHtcbiAgICB2YXIgc2VhcmNoID0gdGhpcztcblxuICAgIC8vIHZhcmlhYmxlc1xuICAgIHNlYXJjaC5tb2RlbE9wdGlvbnMgPSB7XG4gICAgICB1cGRhdGVPbjogJ2RlZmF1bHQgYmx1cicsXG4gICAgICBkZWJvdW5jZToge1xuICAgICAgICAnZGVmYXVsdCc6IDEgKiAxMDAwLFxuICAgICAgICAnYmx1cic6IDBcbiAgICAgIH1cbiAgICB9O1xuICAgIHNlYXJjaC5yZWNlbnRTZWFyY2hlcyAgICAgID0gU3RvcmFnZVNlcnZpY2UuZ2V0QXJyYXkoJ3JlY2VudFNlYXJjaGVzJykgfHwgW107XG4gICAgc2VhcmNoLnNob3dSZWNlbnRzRHJvcGRvd24gPSBmYWxzZTtcbiAgICB2YXIgaW5pdGlhbExvYWQgICAgICAgICAgICA9IHRydWU7XG4gICAgdmFyIG5ld0FycmF5O1xuICAgIHNlYXJjaC5zZWFyY2hlZFRleHQgICAgICAgID0gJ3NlbGZpZSc7XG5cbiAgICAvLyBtZXRob2RzXG4gICAgc2VhcmNoLmdldFNlYXJjaGVkUGhvdG9zID0gZ2V0U2VhcmNoZWRQaG90b3M7XG4gICAgc2VhcmNoLnVwZGF0ZVBob3RvcyAgICAgID0gdXBkYXRlUGhvdG9zO1xuICAgIHNlYXJjaC50b2dnbGVSZWNlbnRzICAgICA9IHRvZ2dsZVJlY2VudHM7XG4gICAgc2VhcmNoLmxvYWRNb3JlUGhvdG9zICAgID0gbG9hZE1vcmVQaG90b3M7XG4gICAgc2VhcmNoLmFkZFBob3RvVG9Db21wYXJlID0gYWRkUGhvdG9Ub0NvbXBhcmU7XG4gICAgc2VhcmNoLnNob3dDb21wYXJlQnV0dG9uID0gc2hvd0NvbXBhcmVCdXR0b247XG4gICAgc2VhcmNoLmhhc0NvbXBhcmVkUGhvdG9zID0gaGFzQ29tcGFyZWRQaG90b3M7XG5cbiAgICAvLyBpbml0aWF0b3JzXG4gICAgZ2V0U2VhcmNoZWRQaG90b3MoJ3NlbGZpZScsIDIwKTtcbiAgICBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKTtcblxuICAgIHNlYXJjaC5zdWdnZXN0ZWRUYWdzID0gW1wiam9oblwiLCBcImJpbGxcIiwgXCJjaGFybGllXCIsIFwicm9iZXJ0XCIsIFwiYWxiYW5cIiwgXCJvc2NhclwiLCBcIm1hcmllXCIsIFwiY2VsaW5lXCIsIFwiYnJhZFwiLCBcImRyZXdcIiwgXCJyZWJlY2NhXCIsIFwibWljaGVsXCIsIFwiZnJhbmNpc1wiLCBcImplYW5cIiwgXCJwYXVsXCIsIFwicGllcnJlXCIsIFwibmljb2xhc1wiLCBcImFsZnJlZFwiLCBcImdlcmFyZFwiLCBcImxvdWlzXCIsIFwiYWxiZXJ0XCIsIFwiZWRvdWFyZFwiLCBcImJlbm9pdFwiLCBcImd1aWxsYXVtZVwiLCBcIm5pY29sYXNcIiwgXCJqb3NlcGhcIl07XG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICBpZighaW5pdGlhbExvYWQpIHtcbiAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIHNlYXJjaC5zZWFyY2hlZFRleHQgPSB0ZXh0O1xuICAgICAgaW5pdGlhbExvYWQgPSBmYWxzZTtcbiAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QgPSBbXTtcbiAgICAgIEZsaWNrclNlcnZpY2UuZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KS50aGVuKGZ1bmN0aW9uKHBob3Rvcykge1xuICAgICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0ID0gcGhvdG9zO1xuICAgICAgICBpZihzZWFyY2gucmVjZW50U2VhcmNoZXMuaW5kZXhPZih0ZXh0KSA9PT0gLTEpIHtcbiAgICAgICAgICBzZWFyY2gucmVjZW50U2VhcmNoZXMucHVzaCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZE1vcmVQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICBGbGlja3JTZXJ2aWNlLmdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkudGhlbihmdW5jdGlvbihwaG90b3MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocGhvdG9zKTtcbiAgICAgICAgcGhvdG9zLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVQaG90b3MobmV3VmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ld1ZhbHVlKTtcbiAgICAgIGlmKG5ld1ZhbHVlICE9PSAnJyB8fCB0eXBlb2YgbmV3VmFsdWUgIT09ICd1bmRlZmluZWQnIHx8ICFmYWxzZSkge1xuICAgICAgICBnZXRTZWFyY2hlZFBob3RvcyhuZXdWYWx1ZSwgMjApO1xuICAgICAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVJlY2VudHMoKSB7XG4gICAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9ICFzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93bjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRQaG90b1RvQ29tcGFyZShwaG90bykge1xuICAgICAgdmFyIHVybCA9ICdodHRwczovL2Zhcm0nICsgcGhvdG8uZmFybSArICcuc3RhdGljZmxpY2tyLmNvbS8nICsgcGhvdG8uc2VydmVyICsgJy8nICsgcGhvdG8uaWQgKyAnXycgKyBwaG90by5zZWNyZXQgKyAnX2IuanBnJztcbiAgICAgIGlmKG5ld0FycmF5LmluZGV4T2YodXJsKSA9PT0gLTEpIHtcbiAgICAgICAgY29uc29sZS5sb2cobmV3QXJyYXkpO1xuICAgICAgICBuZXdBcnJheS5wdXNoKHVybCk7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ld0FycmF5KTtcbiAgICAgICAgTG9jYWxTdG9yYWdlU2VydmljZS5zZXRPYmplY3QoJ2NvbXBhcmVkVXJscycsIG5ld0FycmF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbHJlYWR5IGluIGNvbXBhcmlzb24gbGlzdCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvbXBhcmVkUGhvdG9zTGlzdCgpIHtcbiAgICAgIHZhciBjb21wYXJlVXJscyA9IExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0T2JqZWN0KCdjb21wYXJlZFVybHMnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmVVcmxzWzBdICE9PSB1bmRlZmluZWQpO1xuICAgICAgaWYoY29tcGFyZVVybHNbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdBcnJheSA9IGNvbXBhcmVVcmxzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3QXJyYXkgPSBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93Q29tcGFyZUJ1dHRvbihwaG90bykge1xuICAgICAgdmFyIHVybCA9ICdodHRwczovL2Zhcm0nICsgcGhvdG8uZmFybSArICcuc3RhdGljZmxpY2tyLmNvbS8nICsgcGhvdG8uc2VydmVyICsgJy8nICsgcGhvdG8uaWQgKyAnXycgKyBwaG90by5zZWNyZXQgKyAnX2IuanBnJztcbiAgICAgIGlmKG5ld0FycmF5LmluZGV4T2YodXJsKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzQ29tcGFyZWRQaG90b3MoKSB7XG4gICAgICBpZih0eXBlb2YgTG9jYWxTdG9yYWdlU2VydmljZS5nZXRPYmplY3QoJ2NvbXBhcmVkVXJscycpWzBdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbiAgZnVuY3Rpb24gaWNvbkFkZENvbXBhcmUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICB0ZW1wbGF0ZTogW1xuICAgICAgJzxzdmcgY2xhc3M9XCJpY29uLWFkZC1waG90b3NcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIi0xIC0xIDMxIDI1XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPicsXG4gICAgICAgIFwiPHRpdGxlPlR3byBwaG90b3Mgc3RhY2tlZCB3aXRoIGFuIGFkZCBpY29uIGluIHRoZSBjb3JuZXI8L3RpdGxlPlwiLFxuICAgICAgICBcIjxkZXNjPkxldHMgdGhlIHVzZXIgYWRkIGEgbmV3IHBob3RvIHRvIHRoZWlyIGxpc3Qgb2YgY29tcGFyZWQgaW1hZ2VzPC9kZXNjPlwiLFxuICAgICAgICBcIjxnIGNsYXNzPSdzdmctY29tcGFyZS1pY29ucyc+XCIsXG4gICAgICAgICAgXCI8ZyBzdHJva2Utd2lkdGg9JzEnPlwiLFxuICAgICAgICAgICAgXCI8cGF0aCBkPSdNMC4xMTgxNDk5MzUsNC41MDk2Mzg0NCBMMTEuODM3NDM5NCwwLjgwMjcwNDI4NiBMMTguMTc4NTg1NywxNy43MjAyNjE5IEw2LjQ1OTI5NjI5LDIxLjQyNzE5NiBMMC4xMTgxNDk5MzUsNC41MDk2Mzg0NCBMMC4xMTgxNDk5MzUsNC41MDk2Mzg0NCBaJz48L3BhdGg+XCIsXG4gICAgICAgICAgICBcIjxwYXRoIGQ9J00xOC4wMDAzNzA4LDAuMjQzMzU3NjMzIEwyOC42MjQ1ODQ4LDYuMTA3NjA1MTEgTDE4LjU5MzEwMDUsMjEuNDQ0MzUgTDcuOTY4ODg2NTMsMTUuNTgwMTAyNSBMMTguMDAwMzcwOCwwLjI0MzM1NzYzMyBMMTguMDAwMzcwOCwwLjI0MzM1NzYzMyBaJz48L3BhdGg+XCIsXG4gICAgICAgICAgXCI8L2c+XCIsXG4gICAgICAgICAgXCI8Zz5cIixcbiAgICAgICAgICAgICc8ZWxsaXBzZSBjeD1cIjUuNTQxODY1NzNcIiBjeT1cIjUuMTUwODMwNTZcIiByeD1cIjUuNTQxODY1NzNcIiByeT1cIjUuMTUwODMwNTZcIj48L2VsbGlwc2U+JyxcbiAgICAgICAgICAgICc8cGF0aCBkPVwiTTUuMTg4MjA3MTksNC44MDc5NzM0MiBMNS4xODgyMDcxOSwyLjQwNzk3MzQyIEw1Ljg5NTUyNDI2LDIuNDA3OTczNDIgTDUuODk1NTI0MjYsNC44MDc5NzM0MiBMOC4zNzExMzQwMiw0LjgwNzk3MzQyIEw4LjM3MTEzNDAyLDUuNDkzNjg3NzEgTDUuODk1NTI0MjYsNS40OTM2ODc3MScsICdMNS44OTU1MjQyNiw3Ljg5MzY4NzcxJywgJ0w1LjE4ODIwNzE5LDcuODkzNjg3NzEgTDUuMTg4MjA3MTksNS40OTM2ODc3MSBMMi43MTI1OTc0NCw1LjQ5MzY4NzcxIEwyLjcxMjU5NzQ0LDQuODA3OTczNDIgTDUuMTg4MjA3MTksNC44MDc5NzM0MiBaXCI+PC9wYXRoPicsXG4gICAgICAgICAgJzwvZz4nLFxuICAgICAgICAnPC9nPicsXG4gICAgICAnPC9zdmc+J1xuICAgICAgXS5qb2luKCcnKVxuICAgIH07XG4gIH1cblxuICBhbmd1bGFyXG4gIC5tb2R1bGUoJ2RpZmZyLmRpcmVjdGl2ZXMnKVxuICAuZGlyZWN0aXZlKCdpY29uQWRkQ29tcGFyZScsIGljb25BZGRDb21wYXJlKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5maWx0ZXJzJywgW10pO1xuXG4gIGZ1bmN0aW9uIGNhcGl0YWxpemUoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICBjb25zb2xlLmxvZyhpbnB1dCk7XG4gICAgICBpZih0eXBlb2YgaW5wdXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBpbnB1dC5zdWJzdHJpbmcoMCwxKS50b1VwcGVyQ2FzZSgpICsgaW5wdXQuc3Vic3RyaW5nKDEpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnZGlmZnIuZmlsdGVycycpXG4gICAgLmZpbHRlcignY2FwaXRhbGl6ZScsIGNhcGl0YWxpemUpO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnRmxpY2tyU2VydmljZScsIEZsaWNrclNlcnZpY2UpO1xuXG4gIEZsaWNrclNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnXTtcblxuICBmdW5jdGlvbiBGbGlja3JTZXJ2aWNlKCRodHRwLCAkcSkge1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIGZsaWNrcktleSA9ICc1MmViY2ZjNTcyMDY2OTgzMjY5YmY1MTQwNzA4MDg2ZCcsXG4gICAgZmxpY2tyU2VjcmV0ICA9ICdlOGQ1M2EyZmY3MGIxMDc3JztcblxuICAgIC8vIG1ldGhvZHNcbiAgICB0aGlzLmdldFNlYXJjaGVkUGhvdG9zID0gZ2V0U2VhcmNoZWRQaG90b3M7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuXG4gICAgICAkaHR0cC5nZXQoJ2h0dHBzOi8vYXBpLmZsaWNrci5jb20vc2VydmljZXMvcmVzdC8/bWV0aG9kPWZsaWNrci5waG90b3Muc2VhcmNoJmFwaV9rZXk9JyArIGZsaWNrcktleSArICcmdGFncz0nICsgdGV4dCArICcmcGVyX3BhZ2U9JyArIGFtb3VudCArICcmZm9ybWF0PWpzb24mbm9qc29uY2FsbGJhY2s9MScpXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGRlZmVyLnJlc29sdmUoZGF0YS5waG90b3MucGhvdG8pO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnJvciwgc3RhdHVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgZGVmZXIucmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcblxuICAgIH1cblxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycpLnNlcnZpY2UoJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlKTtcblxuICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLiRpbmplY3QgPSBbJyR3aW5kb3cnXTtcblxuICBmdW5jdGlvbiBMb2NhbFN0b3JhZ2VTZXJ2aWNlKCR3aW5kb3cpIHtcblxuICAgIC8vIHZhcmlhYmxlc1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuc2V0ID0gc2V0O1xuICAgIHRoaXMuZ2V0ID0gZ2V0O1xuICAgIHRoaXMuc2V0T2JqZWN0ID0gc2V0T2JqZWN0O1xuICAgIHRoaXMuZ2V0T2JqZWN0ID0gZ2V0T2JqZWN0O1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgXHQkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgXHRyZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2JqZWN0KGtleSwgdmFsdWUpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T2JqZWN0KGtleSkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCAne30nKTtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnU3RvcmFnZVNlcnZpY2UnLCBTdG9yYWdlU2VydmljZSk7XG5cbiAgU3RvcmFnZVNlcnZpY2UuJGluamVjdCA9IFtdO1xuXG4gIGZ1bmN0aW9uIFN0b3JhZ2VTZXJ2aWNlKCkge1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIHN0b3JhZ2VPYmplY3QgICAgICA9IHt9O1xuICAgIHN0b3JhZ2VPYmplY3Qub2JqZWN0cyAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0LmFycmF5cyAgID0ge307XG4gICAgc3RvcmFnZU9iamVjdC5zdHJpbmdzICA9IHt9O1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuc2V0T2JqZWN0ICAgICA9IHNldE9iamVjdDtcbiAgICB0aGlzLmdldE9iamVjdCAgICAgPSBnZXRPYmplY3Q7XG4gICAgdGhpcy5zZXRBcnJheSAgICAgID0gc2V0QXJyYXk7XG4gICAgdGhpcy5nZXRBcnJheSAgICAgID0gZ2V0QXJyYXk7XG4gICAgdGhpcy5zZXRTdHJpbmcgICAgID0gc2V0U3RyaW5nO1xuICAgIHRoaXMuZ2V0U3RyaW5nICAgICA9IGdldFN0cmluZztcbiAgICB0aGlzLmdldEFsbFN0b3JhZ2UgPSBnZXRBbGxTdG9yYWdlO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIHNldE9iamVjdChrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0Lm9iamVjdHNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldE9iamVjdChrZXkpIHtcblx0XHRcdHJldHVybiBzdG9yYWdlT2JqZWN0Lm9iamVjdHNba2V5XTtcblx0XHR9XG5cbiAgICBmdW5jdGlvbiBzZXRBcnJheShrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0LmFycmF5c1trZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXJyYXkoa2V5KSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdC5hcnJheXNba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRTdHJpbmcoa2V5LCB2YWx1ZSkge1xuICAgICAgc3RvcmFnZU9iamVjdC5zdHJpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdHJpbmcoa2V5KSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdC5zdHJpbmdzW2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWxsU3RvcmFnZSgpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0O1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=