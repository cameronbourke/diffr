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

    var test = ["https://farm8.staticflickr.com/7590/17241926602_e4833c4f8c_b.jpg"];
    test.splice(0, 1);
    console.log(test);

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
    search.loading             = true;

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
        search.loading = false;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiY3RybHMvY29tcGFyZS5jb250cm9sbGVyLmpzIiwiY3RybHMvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2RpcmVjdGl2ZXMuanMiLCJzZXJ2aWNlcy9mbGlja3Iuc2VydmljZS5qcyIsInNlcnZpY2VzL2xvY2FsU3RvcmFnZS5zZXJ2aWNlLmpzIiwic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkaWZmci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnZGlmZnInLCBbXG4gICduZ0FuaW1hdGUnLFxuICAndWkucm91dGVyJyxcbiAgJ2RpZmZyLmNvbnRyb2xsZXJzJyxcbiAgJ2RpZmZyLmZpbHRlcnMnLFxuICAnZGlmZnIuY29uZmlnJyxcbiAgJ2RpZmZyLmRpcmVjdGl2ZXMnLFxuICAnZGlmZnIuc2VydmljZXMnLFxuICAnaW5maW5pdGUtc2Nyb2xsJ1xuXSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5maWx0ZXJzJywgW10pO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29uZmlnJywgW10pO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb25maWcnKS5jb25maWcocm91dGVDb25maWcpO1xuXG4gIHJvdXRlQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuXG4gIGZ1bmN0aW9uIHJvdXRlQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gICRzdGF0ZVByb3ZpZGVyXG5cbiAgLnN0YXRlKCdzZWFyY2gnLCB7XG4gICAgdXJsOiBcIi9zZWFyY2hcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvc2VhcmNoLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIlNlYXJjaEN0cmxcIixcbiAgICBjb250cm9sbGVyQXM6IFwic2VhcmNoXCIsXG4gIH0pXG5cbiAgLnN0YXRlKCdjb21wYXJlJywge1xuICAgIHVybDogXCIvY29tcGFyZVwiLFxuICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9jb21wYXJlLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIkNvbXBhcmVDdHJsXCIsXG4gICAgY29udHJvbGxlckFzOiBcImNvbXBhcmVcIixcbiAgfSk7XG5cbiAgLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3NlYXJjaCcpO1xufVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQXBwQ3RybCcsIEFwcEN0cmwpO1xuXG4gIEFwcEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnXTtcblxuICBmdW5jdGlvbiBBcHBDdHJsKCRzY29wZSwgJHJvb3RTY29wZSkge1xuICAgIHZhciBhcHAgPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDb21wYXJlQ3RybCcsIENvbXBhcmVDdHJsKTtcblxuICBDb21wYXJlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdMb2NhbFN0b3JhZ2VTZXJ2aWNlJywgJ0ZsaWNrclNlcnZpY2UnLCAnU3RvcmFnZVNlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBDb21wYXJlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsIExvY2FsU3RvcmFnZVNlcnZpY2UsIEZsaWNrclNlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgdmFyIGNvbXBhcmUgPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG4gICAgY29tcGFyZS5yZW1vdmVDb21wYXJlZFBob3RvID0gcmVtb3ZlQ29tcGFyZWRQaG90bztcblxuICAgIC8vIGluaXRpYXRvcnNcbiAgICBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKTtcblxuXG5cbiAgICBmdW5jdGlvbiBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKSB7XG4gICAgICB2YXIgY29tcGFyZVVybHMgPSBMb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldE9iamVjdCgnY29tcGFyZWRVcmxzJyk7XG4gICAgICBpZihjb21wYXJlVXJsc1swXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbXBhcmUuY29tcGFyZWRQaG90b3NMaXN0ID0gY29tcGFyZVVybHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wYXJlLmNvbXBhcmVkUGhvdG9zTGlzdCA9IFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUNvbXBhcmVkUGhvdG8odXJsKSB7XG4gICAgICB2YXIgY29tcGFyZUFyciA9IExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0T2JqZWN0KCdjb21wYXJlZFVybHMnKSxcbiAgICAgIHVybEluZGV4ICAgICAgID0gY29tcGFyZUFyci5pbmRleE9mKHVybCk7XG4gICAgICBjb21wYXJlQXJyLnNwbGljZSh1cmxJbmRleCwgMSk7XG4gICAgICBjb21wYXJlLmNvbXBhcmVkUGhvdG9zTGlzdCA9IGNvbXBhcmVBcnI7XG4gICAgICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldE9iamVjdCgnY29tcGFyZWRVcmxzJywgY29tcGFyZUFycik7XG4gICAgfVxuXG4gICAgdmFyIHRlc3QgPSBbXCJodHRwczovL2Zhcm04LnN0YXRpY2ZsaWNrci5jb20vNzU5MC8xNzI0MTkyNjYwMl9lNDgzM2M0ZjhjX2IuanBnXCJdO1xuICAgIHRlc3Quc3BsaWNlKDAsIDEpO1xuICAgIGNvbnNvbGUubG9nKHRlc3QpO1xuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlYXJjaEN0cmwnLCBTZWFyY2hDdHJsKTtcblxuICBTZWFyY2hDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnRmxpY2tyU2VydmljZScsICdTdG9yYWdlU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIFNlYXJjaEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlLCBGbGlja3JTZXJ2aWNlLCBTdG9yYWdlU2VydmljZSkge1xuICAgIHZhciBzZWFyY2ggPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgc2VhcmNoLm1vZGVsT3B0aW9ucyA9IHtcbiAgICAgIHVwZGF0ZU9uOiAnZGVmYXVsdCBibHVyJyxcbiAgICAgIGRlYm91bmNlOiB7XG4gICAgICAgICdkZWZhdWx0JzogMSAqIDEwMDAsXG4gICAgICAgICdibHVyJzogMFxuICAgICAgfVxuICAgIH07XG4gICAgc2VhcmNoLnJlY2VudFNlYXJjaGVzICAgICAgPSBTdG9yYWdlU2VydmljZS5nZXRBcnJheSgncmVjZW50U2VhcmNoZXMnKSB8fCBbXTtcbiAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9IGZhbHNlO1xuICAgIHZhciBpbml0aWFsTG9hZCAgICAgICAgICAgID0gdHJ1ZTtcbiAgICB2YXIgbmV3QXJyYXk7XG4gICAgc2VhcmNoLnNlYXJjaGVkVGV4dCAgICAgICAgPSAnc2VsZmllJztcbiAgICBzZWFyY2gubG9hZGluZyAgICAgICAgICAgICA9IHRydWU7XG5cbiAgICAvLyBtZXRob2RzXG4gICAgc2VhcmNoLmdldFNlYXJjaGVkUGhvdG9zID0gZ2V0U2VhcmNoZWRQaG90b3M7XG4gICAgc2VhcmNoLnVwZGF0ZVBob3RvcyAgICAgID0gdXBkYXRlUGhvdG9zO1xuICAgIHNlYXJjaC50b2dnbGVSZWNlbnRzICAgICA9IHRvZ2dsZVJlY2VudHM7XG4gICAgc2VhcmNoLmxvYWRNb3JlUGhvdG9zICAgID0gbG9hZE1vcmVQaG90b3M7XG4gICAgc2VhcmNoLmFkZFBob3RvVG9Db21wYXJlID0gYWRkUGhvdG9Ub0NvbXBhcmU7XG4gICAgc2VhcmNoLnNob3dDb21wYXJlQnV0dG9uID0gc2hvd0NvbXBhcmVCdXR0b247XG5cbiAgICAvLyBpbml0aWF0b3JzXG4gICAgZ2V0U2VhcmNoZWRQaG90b3MoJ3NlbGZpZScsIDIwKTtcbiAgICBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKTtcblxuXG5cbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hlZFBob3Rvcyh0ZXh0LCBhbW91bnQpIHtcbiAgICAgIGlmKCFpbml0aWFsTG9hZCkge1xuICAgICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3MgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgc2VhcmNoLnNlYXJjaGVkVGV4dCA9IHRleHQ7XG4gICAgICBpbml0aWFsTG9hZCA9IGZhbHNlO1xuICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zTGlzdCA9IFtdO1xuICAgICAgRmxpY2tyU2VydmljZS5nZXRTZWFyY2hlZFBob3Rvcyh0ZXh0LCBhbW91bnQpLnRoZW4oZnVuY3Rpb24ocGhvdG9zKSB7XG4gICAgICAgIHNlYXJjaC5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QgPSBwaG90b3M7XG4gICAgICAgIGlmKHNlYXJjaC5yZWNlbnRTZWFyY2hlcy5pbmRleE9mKHRleHQpID09PSAtMSkge1xuICAgICAgICAgIHNlYXJjaC5yZWNlbnRTZWFyY2hlcy5wdXNoKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkTW9yZVBob3Rvcyh0ZXh0LCBhbW91bnQpIHtcbiAgICAgIEZsaWNrclNlcnZpY2UuZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KS50aGVuKGZ1bmN0aW9uKHBob3Rvcykge1xuICAgICAgICBjb25zb2xlLmxvZyhwaG90b3MpO1xuICAgICAgICBwaG90b3MuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zTGlzdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBob3RvcyhuZXdWYWx1ZSkge1xuICAgICAgY29uc29sZS5sb2cobmV3VmFsdWUpO1xuICAgICAgaWYobmV3VmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGdldFNlYXJjaGVkUGhvdG9zKG5ld1ZhbHVlLCAyMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlUmVjZW50cygpIHtcbiAgICAgIHNlYXJjaC5zaG93UmVjZW50c0Ryb3Bkb3duID0gIXNlYXJjaC5zaG93UmVjZW50c0Ryb3Bkb3duO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFBob3RvVG9Db21wYXJlKHBob3RvKSB7XG4gICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vZmFybScgKyBwaG90by5mYXJtICsgJy5zdGF0aWNmbGlja3IuY29tLycgKyBwaG90by5zZXJ2ZXIgKyAnLycgKyBwaG90by5pZCArICdfJyArIHBob3RvLnNlY3JldCArICdfYi5qcGcnO1xuICAgICAgaWYobmV3QXJyYXkuaW5kZXhPZih1cmwpID09PSAtMSkge1xuICAgICAgICBjb25zb2xlLmxvZyhuZXdBcnJheSk7XG4gICAgICAgIG5ld0FycmF5LnB1c2godXJsKTtcbiAgICAgICAgY29uc29sZS5sb2cobmV3QXJyYXkpO1xuICAgICAgICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldE9iamVjdCgnY29tcGFyZWRVcmxzJywgbmV3QXJyYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FscmVhZHkgaW4gY29tcGFyaXNvbiBsaXN0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q29tcGFyZWRQaG90b3NMaXN0KCkge1xuICAgICAgdmFyIGNvbXBhcmVVcmxzID0gTG9jYWxTdG9yYWdlU2VydmljZS5nZXRPYmplY3QoJ2NvbXBhcmVkVXJscycpO1xuICAgICAgY29uc29sZS5sb2coY29tcGFyZVVybHNbMF0gIT09IHVuZGVmaW5lZCk7XG4gICAgICBpZihjb21wYXJlVXJsc1swXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld0FycmF5ID0gY29tcGFyZVVybHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdBcnJheSA9IFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNob3dDb21wYXJlQnV0dG9uKHBob3RvKSB7XG4gICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vZmFybScgKyBwaG90by5mYXJtICsgJy5zdGF0aWNmbGlja3IuY29tLycgKyBwaG90by5zZXJ2ZXIgKyAnLycgKyBwaG90by5pZCArICdfJyArIHBob3RvLnNlY3JldCArICdfYi5qcGcnO1xuICAgICAgaWYobmV3QXJyYXkuaW5kZXhPZih1cmwpID09PSAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuZGlyZWN0aXZlcycsIFtdKTtcblxuICBmdW5jdGlvbiBtb2RhbCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi4vdGVtcGxhdGVzL21vZGFsLmh0bWwnXG4gICAgfTtcbiAgfVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnZGlmZnIuZGlyZWN0aXZlcycpXG4gICAgLmRpcmVjdGl2ZSgnbW9kYWwnLCBtb2RhbCk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdGbGlja3JTZXJ2aWNlJywgRmxpY2tyU2VydmljZSk7XG5cbiAgRmxpY2tyU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckcSddO1xuXG4gIGZ1bmN0aW9uIEZsaWNrclNlcnZpY2UoJGh0dHAsICRxKSB7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICB2YXIgZmxpY2tyS2V5ID0gJzUyZWJjZmM1NzIwNjY5ODMyNjliZjUxNDA3MDgwODZkJyxcbiAgICBmbGlja3JTZWNyZXQgID0gJ2U4ZDUzYTJmZjcwYjEwNzcnO1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuZ2V0U2VhcmNoZWRQaG90b3MgPSBnZXRTZWFyY2hlZFBob3RvcztcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG5cbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hlZFBob3Rvcyh0ZXh0LCBhbW91bnQpIHtcbiAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICRodHRwLmdldCgnaHR0cHM6Ly9hcGkuZmxpY2tyLmNvbS9zZXJ2aWNlcy9yZXN0Lz9tZXRob2Q9ZmxpY2tyLnBob3Rvcy5zZWFyY2gmYXBpX2tleT0nICsgZmxpY2tyS2V5ICsgJyZ0YWdzPScgKyB0ZXh0ICsgJyZwZXJfcGFnZT0nICsgYW1vdW50ICsgJyZmb3JtYXQ9anNvbiZub2pzb25jYWxsYmFjaz0xJylcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgZGVmZXIucmVzb2x2ZShkYXRhLnBob3Rvcy5waG90byk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycm9yLCBzdGF0dXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICBkZWZlci5yZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuXG4gICAgfVxuXG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnTG9jYWxTdG9yYWdlU2VydmljZScsIExvY2FsU3RvcmFnZVNlcnZpY2UpO1xuXG4gIExvY2FsU3RvcmFnZVNlcnZpY2UuJGluamVjdCA9IFsnJHdpbmRvdyddO1xuXG4gIGZ1bmN0aW9uIExvY2FsU3RvcmFnZVNlcnZpY2UoJHdpbmRvdykge1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG4gICAgdGhpcy5zZXQgPSBzZXQ7XG4gICAgdGhpcy5nZXQgPSBnZXQ7XG4gICAgdGhpcy5zZXRPYmplY3QgPSBzZXRPYmplY3Q7XG4gICAgdGhpcy5nZXRPYmplY3QgPSBnZXRPYmplY3Q7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICBcdCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQoa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICBcdHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPYmplY3Qoa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPYmplY3Qoa2V5KSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdTdG9yYWdlU2VydmljZScsIFN0b3JhZ2VTZXJ2aWNlKTtcblxuICBTdG9yYWdlU2VydmljZS4kaW5qZWN0ID0gW107XG5cbiAgZnVuY3Rpb24gU3RvcmFnZVNlcnZpY2UoKSB7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICB2YXIgc3RvcmFnZU9iamVjdCAgICAgID0ge307XG4gICAgc3RvcmFnZU9iamVjdC5vYmplY3RzICA9IHt9O1xuICAgIHN0b3JhZ2VPYmplY3QuYXJyYXlzICAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0LnN0cmluZ3MgID0ge307XG5cbiAgICAvLyBtZXRob2RzXG4gICAgdGhpcy5zZXRPYmplY3QgICAgID0gc2V0T2JqZWN0O1xuICAgIHRoaXMuZ2V0T2JqZWN0ICAgICA9IGdldE9iamVjdDtcbiAgICB0aGlzLnNldEFycmF5ICAgICAgPSBzZXRBcnJheTtcbiAgICB0aGlzLmdldEFycmF5ICAgICAgPSBnZXRBcnJheTtcbiAgICB0aGlzLnNldFN0cmluZyAgICAgPSBzZXRTdHJpbmc7XG4gICAgdGhpcy5nZXRTdHJpbmcgICAgID0gZ2V0U3RyaW5nO1xuICAgIHRoaXMuZ2V0QWxsU3RvcmFnZSA9IGdldEFsbFN0b3JhZ2U7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gc2V0T2JqZWN0KGtleSwgdmFsdWUpIHtcbiAgICAgIHN0b3JhZ2VPYmplY3Qub2JqZWN0c1trZXldID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0T2JqZWN0KGtleSkge1xuXHRcdFx0cmV0dXJuIHN0b3JhZ2VPYmplY3Qub2JqZWN0c1trZXldO1xuXHRcdH1cblxuICAgIGZ1bmN0aW9uIHNldEFycmF5KGtleSwgdmFsdWUpIHtcbiAgICAgIHN0b3JhZ2VPYmplY3QuYXJyYXlzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBcnJheShrZXkpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0LmFycmF5c1trZXldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFN0cmluZyhrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0LnN0cmluZ3Nba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0cmluZyhrZXkpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0LnN0cmluZ3Nba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBbGxTdG9yYWdlKCkge1xuICAgICAgcmV0dXJuIHN0b3JhZ2VPYmplY3Q7XG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==