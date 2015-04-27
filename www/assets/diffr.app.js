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
angular.module('diffr.filters', []);

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

    // initiators
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
      if(newValue !== '') {
        getSearchedPhotos(newValue, 20);
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

  }

})();

(function() {
  'use strict';

  angular.module('diffr.directives', []);

  function modal() {
    return {
      restrict: 'E',
      templateUrl: '../templates/modal.html'
    };
  }
  angular
    .module('diffr.directives')
    .directive('modal', modal);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiY3RybHMvY29tcGFyZS5jb250cm9sbGVyLmpzIiwiY3RybHMvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2RpcmVjdGl2ZXMuanMiLCJzZXJ2aWNlcy9mbGlja3Iuc2VydmljZS5qcyIsInNlcnZpY2VzL2xvY2FsU3RvcmFnZS5zZXJ2aWNlLmpzIiwic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkaWZmci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnZGlmZnInLCBbXG4gICduZ0FuaW1hdGUnLFxuICAndWkucm91dGVyJyxcbiAgJ2RpZmZyLmNvbnRyb2xsZXJzJyxcbiAgJ2RpZmZyLmZpbHRlcnMnLFxuICAnZGlmZnIuY29uZmlnJyxcbiAgJ2RpZmZyLmRpcmVjdGl2ZXMnLFxuICAnZGlmZnIuc2VydmljZXMnLFxuICAnaW5maW5pdGUtc2Nyb2xsJ1xuXSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5maWx0ZXJzJywgW10pO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29uZmlnJywgW10pO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb25maWcnKS5jb25maWcocm91dGVDb25maWcpO1xuXG4gIHJvdXRlQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuXG4gIGZ1bmN0aW9uIHJvdXRlQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gICRzdGF0ZVByb3ZpZGVyXG5cbiAgLnN0YXRlKCdzZWFyY2gnLCB7XG4gICAgdXJsOiBcIi9zZWFyY2hcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvc2VhcmNoLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIlNlYXJjaEN0cmxcIixcbiAgICBjb250cm9sbGVyQXM6IFwic2VhcmNoXCIsXG4gIH0pXG5cbiAgLnN0YXRlKCdjb21wYXJlJywge1xuICAgIHVybDogXCIvY29tcGFyZVwiLFxuICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9jb21wYXJlLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIkNvbXBhcmVDdHJsXCIsXG4gICAgY29udHJvbGxlckFzOiBcImNvbXBhcmVcIixcbiAgfSk7XG5cbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3NlYXJjaCcpO1xufVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQXBwQ3RybCcsIEFwcEN0cmwpO1xuXG4gIEFwcEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnXTtcblxuICBmdW5jdGlvbiBBcHBDdHJsKCRzY29wZSwgJHJvb3RTY29wZSkge1xuICAgIHZhciBhcHAgPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb21wYXJlQ3RybCcsIENvbXBhcmVDdHJsKTtcblxuICBDb21wYXJlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdMb2NhbFN0b3JhZ2VTZXJ2aWNlJywgJ0ZsaWNrclNlcnZpY2UnLCAnU3RvcmFnZVNlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBDb21wYXJlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsIExvY2FsU3RvcmFnZVNlcnZpY2UsIEZsaWNrclNlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgdmFyIGNvbXBhcmUgPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG4gICAgY29tcGFyZS5yZW1vdmVDb21wYXJlZFBob3RvID0gcmVtb3ZlQ29tcGFyZWRQaG90bztcblxuICAgIC8vIGluaXRpYXRvcnNcbiAgICBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKTtcblxuXG5cbiAgICBmdW5jdGlvbiBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKSB7XG4gICAgICB2YXIgY29tcGFyZVVybHMgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldE9iamVjdCgnY29tcGFyZWRVcmxzJyk7XG4gICAgICBpZihjb21wYXJlVXJsc1swXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBhcmUuY29tcGFyZWRQaG90b3NMaXN0ID0gY29tcGFyZVVybHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wYXJlLmNvbXBhcmVkUGhvdG9zTGlzdCA9IFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUNvbXBhcmVkUGhvdG8odXJsKSB7XG4gICAgICB2YXIgY29tcGFyZUFyciA9IExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0T2JqZWN0KCdjb21wYXJlZFVybHMnKSxcbiAgICAgIHVybEluZGV4ICAgICAgID0gY29tcGFyZUFyci5pbmRleE9mKHVybCk7XG4gICAgICBjb21wYXJlQXJyLnNwbGljZSh1cmxJbmRleCwgMSk7XG4gICAgICBjb21wYXJlLmNvbXBhcmVkUGhvdG9zTGlzdCA9IGNvbXBhcmVBcnI7XG4gICAgICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldE9iamVjdCgnY29tcGFyZWRVcmxzJywgY29tcGFyZUFycik7XG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlYXJjaEN0cmwnLCBTZWFyY2hDdHJsKTtcblxuICBTZWFyY2hDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnRmxpY2tyU2VydmljZScsICdTdG9yYWdlU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIFNlYXJjaEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlLCBGbGlja3JTZXJ2aWNlLCBTdG9yYWdlU2VydmljZSkge1xuICAgIHZhciBzZWFyY2ggPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgc2VhcmNoLm1vZGVsT3B0aW9ucyA9IHtcbiAgICAgIHVwZGF0ZU9uOiAnZGVmYXVsdCBibHVyJyxcbiAgICAgIGRlYm91bmNlOiB7XG4gICAgICAgICdkZWZhdWx0JzogMSAqIDEwMDAsXG4gICAgICAgICdibHVyJzogMFxuICAgICAgfVxuICAgIH07XG4gICAgc2VhcmNoLnJlY2VudFNlYXJjaGVzICAgICAgPSBTdG9yYWdlU2VydmljZS5nZXRBcnJheSgncmVjZW50U2VhcmNoZXMnKSB8fCBbXTtcbiAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9IGZhbHNlO1xuICAgIHZhciBpbml0aWFsTG9hZCAgICAgICAgICAgID0gdHJ1ZTtcbiAgICB2YXIgbmV3QXJyYXk7XG4gICAgc2VhcmNoLnNlYXJjaGVkVGV4dCAgICAgICAgPSAnc2VsZmllJztcblxuICAgIC8vIG1ldGhvZHNcbiAgICBzZWFyY2guZ2V0U2VhcmNoZWRQaG90b3MgPSBnZXRTZWFyY2hlZFBob3RvcztcbiAgICBzZWFyY2gudXBkYXRlUGhvdG9zICAgICAgPSB1cGRhdGVQaG90b3M7XG4gICAgc2VhcmNoLnRvZ2dsZVJlY2VudHMgICAgID0gdG9nZ2xlUmVjZW50cztcbiAgICBzZWFyY2gubG9hZE1vcmVQaG90b3MgICAgPSBsb2FkTW9yZVBob3RvcztcbiAgICBzZWFyY2guYWRkUGhvdG9Ub0NvbXBhcmUgPSBhZGRQaG90b1RvQ29tcGFyZTtcbiAgICBzZWFyY2guc2hvd0NvbXBhcmVCdXR0b24gPSBzaG93Q29tcGFyZUJ1dHRvbjtcblxuICAgIC8vIGluaXRpYXRvcnNcbiAgICBnZXRTZWFyY2hlZFBob3Rvcygnc2VsZmllJywgMjApO1xuICAgIGdldENvbXBhcmVkUGhvdG9zTGlzdCgpO1xuXG5cblxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkge1xuICAgICAgaWYoIWluaXRpYWxMb2FkKSB7XG4gICAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3RvcyA9IHRleHQ7XG4gICAgICB9XG4gICAgICBzZWFyY2guc2VhcmNoZWRUZXh0ID0gdGV4dDtcbiAgICAgIGluaXRpYWxMb2FkID0gZmFsc2U7XG4gICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0ID0gW107XG4gICAgICBGbGlja3JTZXJ2aWNlLmdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkudGhlbihmdW5jdGlvbihwaG90b3MpIHtcbiAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zTGlzdCA9IHBob3RvcztcbiAgICAgICAgaWYoc2VhcmNoLnJlY2VudFNlYXJjaGVzLmluZGV4T2YodGV4dCkgPT09IC0xKSB7XG4gICAgICAgICAgc2VhcmNoLnJlY2VudFNlYXJjaGVzLnB1c2godGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRNb3JlUGhvdG9zKHRleHQsIGFtb3VudCkge1xuICAgICAgRmxpY2tyU2VydmljZS5nZXRTZWFyY2hlZFBob3Rvcyh0ZXh0LCBhbW91bnQpLnRoZW4oZnVuY3Rpb24ocGhvdG9zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBob3Rvcyk7XG4gICAgICAgIHBob3Rvcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0LnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlUGhvdG9zKG5ld1ZhbHVlKSB7XG4gICAgICBjb25zb2xlLmxvZyhuZXdWYWx1ZSk7XG4gICAgICBpZihuZXdWYWx1ZSAhPT0gJycpIHtcbiAgICAgICAgZ2V0U2VhcmNoZWRQaG90b3MobmV3VmFsdWUsIDIwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVSZWNlbnRzKCkge1xuICAgICAgc2VhcmNoLnNob3dSZWNlbnRzRHJvcGRvd24gPSAhc2VhcmNoLnNob3dSZWNlbnRzRHJvcGRvd247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkUGhvdG9Ub0NvbXBhcmUocGhvdG8pIHtcbiAgICAgIHZhciB1cmwgPSAnaHR0cHM6Ly9mYXJtJyArIHBob3RvLmZhcm0gKyAnLnN0YXRpY2ZsaWNrci5jb20vJyArIHBob3RvLnNlcnZlciArICcvJyArIHBob3RvLmlkICsgJ18nICsgcGhvdG8uc2VjcmV0ICsgJ19iLmpwZyc7XG4gICAgICBpZihuZXdBcnJheS5pbmRleE9mKHVybCkgPT09IC0xKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ld0FycmF5KTtcbiAgICAgICAgbmV3QXJyYXkucHVzaCh1cmwpO1xuICAgICAgICBjb25zb2xlLmxvZyhuZXdBcnJheSk7XG4gICAgICAgIExvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0T2JqZWN0KCdjb21wYXJlZFVybHMnLCBuZXdBcnJheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnYWxyZWFkeSBpbiBjb21wYXJpc29uIGxpc3QnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKSB7XG4gICAgICB2YXIgY29tcGFyZVVybHMgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldE9iamVjdCgnY29tcGFyZWRVcmxzJyk7XG4gICAgICBjb25zb2xlLmxvZyhjb21wYXJlVXJsc1swXSAhPT0gdW5kZWZpbmVkKTtcbiAgICAgIGlmKGNvbXBhcmVVcmxzWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3QXJyYXkgPSBjb21wYXJlVXJscztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0FycmF5ID0gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd0NvbXBhcmVCdXR0b24ocGhvdG8pIHtcbiAgICAgIHZhciB1cmwgPSAnaHR0cHM6Ly9mYXJtJyArIHBob3RvLmZhcm0gKyAnLnN0YXRpY2ZsaWNrci5jb20vJyArIHBob3RvLnNlcnZlciArICcvJyArIHBob3RvLmlkICsgJ18nICsgcGhvdG8uc2VjcmV0ICsgJ19iLmpwZyc7XG4gICAgICBpZihuZXdBcnJheS5pbmRleE9mKHVybCkgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5kaXJlY3RpdmVzJywgW10pO1xuXG4gIGZ1bmN0aW9uIG1vZGFsKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuLi90ZW1wbGF0ZXMvbW9kYWwuaHRtbCdcbiAgICB9O1xuICB9XG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdkaWZmci5kaXJlY3RpdmVzJylcbiAgICAuZGlyZWN0aXZlKCdtb2RhbCcsIG1vZGFsKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycpLnNlcnZpY2UoJ0ZsaWNrclNlcnZpY2UnLCBGbGlja3JTZXJ2aWNlKTtcblxuICBGbGlja3JTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRxJ107XG5cbiAgZnVuY3Rpb24gRmxpY2tyU2VydmljZSgkaHR0cCwgJHEpIHtcblxuICAgIC8vIHZhcmlhYmxlc1xuICAgIHZhciBmbGlja3JLZXkgPSAnNTJlYmNmYzU3MjA2Njk4MzI2OWJmNTE0MDcwODA4NmQnLFxuICAgIGZsaWNrclNlY3JldCAgPSAnZThkNTNhMmZmNzBiMTA3Nyc7XG5cbiAgICAvLyBtZXRob2RzXG4gICAgdGhpcy5nZXRTZWFyY2hlZFBob3RvcyA9IGdldFNlYXJjaGVkUGhvdG9zO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkge1xuICAgICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcblxuICAgICAgJGh0dHAuZ2V0KCdodHRwczovL2FwaS5mbGlja3IuY29tL3NlcnZpY2VzL3Jlc3QvP21ldGhvZD1mbGlja3IucGhvdG9zLnNlYXJjaCZhcGlfa2V5PScgKyBmbGlja3JLZXkgKyAnJnRhZ3M9JyArIHRleHQgKyAnJnBlcl9wYWdlPScgKyBhbW91bnQgKyAnJmZvcm1hdD1qc29uJm5vanNvbmNhbGxiYWNrPTEnKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBkZWZlci5yZXNvbHZlKGRhdGEucGhvdG9zLnBob3RvKTtcbiAgICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3IsIHN0YXR1cykge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIGRlZmVyLnJlamVjdChlcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XG5cbiAgICB9XG5cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdMb2NhbFN0b3JhZ2VTZXJ2aWNlJywgTG9jYWxTdG9yYWdlU2VydmljZSk7XG5cbiAgTG9jYWxTdG9yYWdlU2VydmljZS4kaW5qZWN0ID0gWyckd2luZG93J107XG5cbiAgZnVuY3Rpb24gTG9jYWxTdG9yYWdlU2VydmljZSgkd2luZG93KSB7XG5cbiAgICAvLyB2YXJpYWJsZXNcblxuICAgIC8vIG1ldGhvZHNcbiAgICB0aGlzLnNldCA9IHNldDtcbiAgICB0aGlzLmdldCA9IGdldDtcbiAgICB0aGlzLnNldE9iamVjdCA9IHNldE9iamVjdDtcbiAgICB0aGlzLmdldE9iamVjdCA9IGdldE9iamVjdDtcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG5cbiAgICBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIFx0JHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldChrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIFx0cmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9iamVjdChrZXksIHZhbHVlKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9iamVjdChrZXkpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgJ3t9Jyk7XG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycpLnNlcnZpY2UoJ1N0b3JhZ2VTZXJ2aWNlJywgU3RvcmFnZVNlcnZpY2UpO1xuXG4gIFN0b3JhZ2VTZXJ2aWNlLiRpbmplY3QgPSBbXTtcblxuICBmdW5jdGlvbiBTdG9yYWdlU2VydmljZSgpIHtcblxuICAgIC8vIHZhcmlhYmxlc1xuICAgIHZhciBzdG9yYWdlT2JqZWN0ICAgICAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0Lm9iamVjdHMgID0ge307XG4gICAgc3RvcmFnZU9iamVjdC5hcnJheXMgICA9IHt9O1xuICAgIHN0b3JhZ2VPYmplY3Quc3RyaW5ncyAgPSB7fTtcblxuICAgIC8vIG1ldGhvZHNcbiAgICB0aGlzLnNldE9iamVjdCAgICAgPSBzZXRPYmplY3Q7XG4gICAgdGhpcy5nZXRPYmplY3QgICAgID0gZ2V0T2JqZWN0O1xuICAgIHRoaXMuc2V0QXJyYXkgICAgICA9IHNldEFycmF5O1xuICAgIHRoaXMuZ2V0QXJyYXkgICAgICA9IGdldEFycmF5O1xuICAgIHRoaXMuc2V0U3RyaW5nICAgICA9IHNldFN0cmluZztcbiAgICB0aGlzLmdldFN0cmluZyAgICAgPSBnZXRTdHJpbmc7XG4gICAgdGhpcy5nZXRBbGxTdG9yYWdlID0gZ2V0QWxsU3RvcmFnZTtcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG5cbiAgICBmdW5jdGlvbiBzZXRPYmplY3Qoa2V5LCB2YWx1ZSkge1xuICAgICAgc3RvcmFnZU9iamVjdC5vYmplY3RzW2tleV0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRPYmplY3Qoa2V5KSB7XG5cdFx0XHRyZXR1cm4gc3RvcmFnZU9iamVjdC5vYmplY3RzW2tleV07XG5cdFx0fVxuXG4gICAgZnVuY3Rpb24gc2V0QXJyYXkoa2V5LCB2YWx1ZSkge1xuICAgICAgc3RvcmFnZU9iamVjdC5hcnJheXNba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEFycmF5KGtleSkge1xuICAgICAgcmV0dXJuIHN0b3JhZ2VPYmplY3QuYXJyYXlzW2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0U3RyaW5nKGtleSwgdmFsdWUpIHtcbiAgICAgIHN0b3JhZ2VPYmplY3Quc3RyaW5nc1trZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U3RyaW5nKGtleSkge1xuICAgICAgcmV0dXJuIHN0b3JhZ2VPYmplY3Quc3RyaW5nc1trZXldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEFsbFN0b3JhZ2UoKSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdDtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9