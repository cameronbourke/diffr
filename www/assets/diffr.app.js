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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiY3RybHMvY29tcGFyZS5jb250cm9sbGVyLmpzIiwiY3RybHMvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2RpcmVjdGl2ZXMuanMiLCJzZXJ2aWNlcy9mbGlja3Iuc2VydmljZS5qcyIsInNlcnZpY2VzL2xvY2FsU3RvcmFnZS5zZXJ2aWNlLmpzIiwic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImRpZmZyLmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdkaWZmcicsIFtcbiAgJ25nQW5pbWF0ZScsXG4gICd1aS5yb3V0ZXInLFxuICAnZGlmZnIuY29udHJvbGxlcnMnLFxuICAnZGlmZnIuZmlsdGVycycsXG4gICdkaWZmci5jb25maWcnLFxuICAnZGlmZnIuZGlyZWN0aXZlcycsXG4gICdkaWZmci5zZXJ2aWNlcycsXG4gICdpbmZpbml0ZS1zY3JvbGwnXG5dKTtcblxuYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJywgW10pO1xuYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbnRyb2xsZXJzJywgW10pO1xuYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmZpbHRlcnMnLCBbXSk7XG4iLCIoZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb25maWcnLCBbXSk7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbmZpZycpLmNvbmZpZyhyb3V0ZUNvbmZpZyk7XG5cbiAgcm91dGVDb25maWcuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJ107XG5cbiAgZnVuY3Rpb24gcm91dGVDb25maWcoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gIC8vIElvbmljIHVzZXMgQW5ndWxhclVJIFJvdXRlciB3aGljaCB1c2VzIHRoZSBjb25jZXB0IG9mIHN0YXRlc1xuICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAvLyBFYWNoIHN0YXRlJ3MgY29udHJvbGxlciBjYW4gYmUgZm91bmQgaW4gY29udHJvbGxlcnMuanNcbiAgJHN0YXRlUHJvdmlkZXJcblxuICAuc3RhdGUoJ3NlYXJjaCcsIHtcbiAgICB1cmw6IFwiL3NlYXJjaFwiLFxuICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9zZWFyY2guaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiU2VhcmNoQ3RybFwiLFxuICAgIGNvbnRyb2xsZXJBczogXCJzZWFyY2hcIixcbiAgfSlcblxuICAuc3RhdGUoJ2NvbXBhcmUnLCB7XG4gICAgdXJsOiBcIi9jb21wYXJlXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2NvbXBhcmUuaHRtbFwiLFxuICAgIGNvbnRyb2xsZXI6IFwiQ29tcGFyZUN0cmxcIixcbiAgICBjb250cm9sbGVyQXM6IFwiY29tcGFyZVwiLFxuICB9KTtcblxuICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2VhcmNoJyk7XG59XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBcHBDdHJsJywgQXBwQ3RybCk7XG5cbiAgQXBwQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZSddO1xuXG4gIGZ1bmN0aW9uIEFwcEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG4gICAgdmFyIGFwcCA9IHRoaXM7XG5cbiAgICAvLyB2YXJpYWJsZXNcblxuICAgIC8vIG1ldGhvZHNcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbXBhcmVDdHJsJywgQ29tcGFyZUN0cmwpO1xuXG4gIENvbXBhcmVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnRmxpY2tyU2VydmljZScsICdTdG9yYWdlU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIENvbXBhcmVDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgTG9jYWxTdG9yYWdlU2VydmljZSwgRmxpY2tyU2VydmljZSwgU3RvcmFnZVNlcnZpY2UpIHtcbiAgICB2YXIgY29tcGFyZSA9IHRoaXM7XG5cbiAgICAvLyB2YXJpYWJsZXNcblxuICAgIC8vIG1ldGhvZHNcbiAgICBjb21wYXJlLnJlbW92ZUNvbXBhcmVkUGhvdG8gPSByZW1vdmVDb21wYXJlZFBob3RvO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuICAgIGdldENvbXBhcmVkUGhvdG9zTGlzdCgpO1xuXG5cblxuICAgIGZ1bmN0aW9uIGdldENvbXBhcmVkUGhvdG9zTGlzdCgpIHtcbiAgICAgIHZhciBjb21wYXJlVXJscyA9IExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0T2JqZWN0KCdjb21wYXJlZFVybHMnKTtcbiAgICAgIGlmKGNvbXBhcmVVcmxzWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcGFyZS5jb21wYXJlZFBob3Rvc0xpc3QgPSBjb21wYXJlVXJscztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbXBhcmUuY29tcGFyZWRQaG90b3NMaXN0ID0gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlQ29tcGFyZWRQaG90byh1cmwpIHtcbiAgICAgIHZhciBjb21wYXJlQXJyID0gTG9jYWxTdG9yYWdlU2VydmljZS5nZXRPYmplY3QoJ2NvbXBhcmVkVXJscycpLFxuICAgICAgdXJsSW5kZXggICAgICAgPSBjb21wYXJlQXJyLmluZGV4T2YodXJsKTtcbiAgICAgIGNvbXBhcmVBcnIuc3BsaWNlKHVybEluZGV4LCAxKTtcbiAgICAgIGNvbXBhcmUuY29tcGFyZWRQaG90b3NMaXN0ID0gY29tcGFyZUFycjtcbiAgICAgIExvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0T2JqZWN0KCdjb21wYXJlZFVybHMnLCBjb21wYXJlQXJyKTtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VhcmNoQ3RybCcsIFNlYXJjaEN0cmwpO1xuXG4gIFNlYXJjaEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnTG9jYWxTdG9yYWdlU2VydmljZScsICdGbGlja3JTZXJ2aWNlJywgJ1N0b3JhZ2VTZXJ2aWNlJ107XG5cbiAgZnVuY3Rpb24gU2VhcmNoQ3RybCgkc2NvcGUsICRyb290U2NvcGUsIExvY2FsU3RvcmFnZVNlcnZpY2UsIEZsaWNrclNlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgdmFyIHNlYXJjaCA9IHRoaXM7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICBzZWFyY2gubW9kZWxPcHRpb25zID0ge1xuICAgICAgdXBkYXRlT246ICdkZWZhdWx0IGJsdXInLFxuICAgICAgZGVib3VuY2U6IHtcbiAgICAgICAgJ2RlZmF1bHQnOiAxICogMTAwMCxcbiAgICAgICAgJ2JsdXInOiAwXG4gICAgICB9XG4gICAgfTtcbiAgICBzZWFyY2gucmVjZW50U2VhcmNoZXMgICAgICA9IFN0b3JhZ2VTZXJ2aWNlLmdldEFycmF5KCdyZWNlbnRTZWFyY2hlcycpIHx8IFtdO1xuICAgIHNlYXJjaC5zaG93UmVjZW50c0Ryb3Bkb3duID0gZmFsc2U7XG4gICAgdmFyIGluaXRpYWxMb2FkICAgICAgICAgICAgPSB0cnVlO1xuICAgIHZhciBuZXdBcnJheTtcbiAgICBzZWFyY2guc2VhcmNoZWRUZXh0ICAgICAgICA9ICdzZWxmaWUnO1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHNlYXJjaC5nZXRTZWFyY2hlZFBob3RvcyA9IGdldFNlYXJjaGVkUGhvdG9zO1xuICAgIHNlYXJjaC51cGRhdGVQaG90b3MgICAgICA9IHVwZGF0ZVBob3RvcztcbiAgICBzZWFyY2gudG9nZ2xlUmVjZW50cyAgICAgPSB0b2dnbGVSZWNlbnRzO1xuICAgIHNlYXJjaC5sb2FkTW9yZVBob3RvcyAgICA9IGxvYWRNb3JlUGhvdG9zO1xuICAgIHNlYXJjaC5hZGRQaG90b1RvQ29tcGFyZSA9IGFkZFBob3RvVG9Db21wYXJlO1xuICAgIHNlYXJjaC5zaG93Q29tcGFyZUJ1dHRvbiA9IHNob3dDb21wYXJlQnV0dG9uO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuICAgIGdldFNlYXJjaGVkUGhvdG9zKCdzZWxmaWUnLCAyMCk7XG4gICAgZ2V0Q29tcGFyZWRQaG90b3NMaXN0KCk7XG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICBpZighaW5pdGlhbExvYWQpIHtcbiAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIHNlYXJjaC5zZWFyY2hlZFRleHQgPSB0ZXh0O1xuICAgICAgaW5pdGlhbExvYWQgPSBmYWxzZTtcbiAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QgPSBbXTtcbiAgICAgIEZsaWNrclNlcnZpY2UuZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KS50aGVuKGZ1bmN0aW9uKHBob3Rvcykge1xuICAgICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0ID0gcGhvdG9zO1xuICAgICAgICBpZihzZWFyY2gucmVjZW50U2VhcmNoZXMuaW5kZXhPZih0ZXh0KSA9PT0gLTEpIHtcbiAgICAgICAgICBzZWFyY2gucmVjZW50U2VhcmNoZXMucHVzaCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZE1vcmVQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICBGbGlja3JTZXJ2aWNlLmdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkudGhlbihmdW5jdGlvbihwaG90b3MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocGhvdG9zKTtcbiAgICAgICAgcGhvdG9zLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVQaG90b3MobmV3VmFsdWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKG5ld1ZhbHVlKTtcbiAgICAgIGlmKG5ld1ZhbHVlICE9PSAnJykge1xuICAgICAgICBnZXRTZWFyY2hlZFBob3RvcyhuZXdWYWx1ZSwgMjApO1xuICAgICAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVJlY2VudHMoKSB7XG4gICAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9ICFzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93bjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRQaG90b1RvQ29tcGFyZShwaG90bykge1xuICAgICAgdmFyIHVybCA9ICdodHRwczovL2Zhcm0nICsgcGhvdG8uZmFybSArICcuc3RhdGljZmxpY2tyLmNvbS8nICsgcGhvdG8uc2VydmVyICsgJy8nICsgcGhvdG8uaWQgKyAnXycgKyBwaG90by5zZWNyZXQgKyAnX2IuanBnJztcbiAgICAgIGlmKG5ld0FycmF5LmluZGV4T2YodXJsKSA9PT0gLTEpIHtcbiAgICAgICAgY29uc29sZS5sb2cobmV3QXJyYXkpO1xuICAgICAgICBuZXdBcnJheS5wdXNoKHVybCk7XG4gICAgICAgIGNvbnNvbGUubG9nKG5ld0FycmF5KTtcbiAgICAgICAgTG9jYWxTdG9yYWdlU2VydmljZS5zZXRPYmplY3QoJ2NvbXBhcmVkVXJscycsIG5ld0FycmF5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhbHJlYWR5IGluIGNvbXBhcmlzb24gbGlzdCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvbXBhcmVkUGhvdG9zTGlzdCgpIHtcbiAgICAgIHZhciBjb21wYXJlVXJscyA9IExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0T2JqZWN0KCdjb21wYXJlZFVybHMnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmVVcmxzWzBdICE9PSB1bmRlZmluZWQpO1xuICAgICAgaWYoY29tcGFyZVVybHNbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdBcnJheSA9IGNvbXBhcmVVcmxzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3QXJyYXkgPSBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93Q29tcGFyZUJ1dHRvbihwaG90bykge1xuICAgICAgdmFyIHVybCA9ICdodHRwczovL2Zhcm0nICsgcGhvdG8uZmFybSArICcuc3RhdGljZmxpY2tyLmNvbS8nICsgcGhvdG8uc2VydmVyICsgJy8nICsgcGhvdG8uaWQgKyAnXycgKyBwaG90by5zZWNyZXQgKyAnX2IuanBnJztcbiAgICAgIGlmKG5ld0FycmF5LmluZGV4T2YodXJsKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbiAgZnVuY3Rpb24gbW9kYWwoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4uL3RlbXBsYXRlcy9tb2RhbC5odG1sJ1xuICAgIH07XG4gIH1cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2RpZmZyLmRpcmVjdGl2ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ21vZGFsJywgbW9kYWwpO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnRmxpY2tyU2VydmljZScsIEZsaWNrclNlcnZpY2UpO1xuXG4gIEZsaWNrclNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnXTtcblxuICBmdW5jdGlvbiBGbGlja3JTZXJ2aWNlKCRodHRwLCAkcSkge1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIGZsaWNrcktleSA9ICc1MmViY2ZjNTcyMDY2OTgzMjY5YmY1MTQwNzA4MDg2ZCcsXG4gICAgZmxpY2tyU2VjcmV0ICA9ICdlOGQ1M2EyZmY3MGIxMDc3JztcblxuICAgIC8vIG1ldGhvZHNcbiAgICB0aGlzLmdldFNlYXJjaGVkUGhvdG9zID0gZ2V0U2VhcmNoZWRQaG90b3M7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuXG4gICAgICAkaHR0cC5nZXQoJ2h0dHBzOi8vYXBpLmZsaWNrci5jb20vc2VydmljZXMvcmVzdC8/bWV0aG9kPWZsaWNrci5waG90b3Muc2VhcmNoJmFwaV9rZXk9JyArIGZsaWNrcktleSArICcmdGFncz0nICsgdGV4dCArICcmcGVyX3BhZ2U9JyArIGFtb3VudCArICcmZm9ybWF0PWpzb24mbm9qc29uY2FsbGJhY2s9MScpXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGRlZmVyLnJlc29sdmUoZGF0YS5waG90b3MucGhvdG8pO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnJvciwgc3RhdHVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgZGVmZXIucmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcblxuICAgIH1cblxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycpLnNlcnZpY2UoJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlKTtcblxuICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLiRpbmplY3QgPSBbJyR3aW5kb3cnXTtcblxuICBmdW5jdGlvbiBMb2NhbFN0b3JhZ2VTZXJ2aWNlKCR3aW5kb3cpIHtcblxuICAgIC8vIHZhcmlhYmxlc1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuc2V0ID0gc2V0O1xuICAgIHRoaXMuZ2V0ID0gZ2V0O1xuICAgIHRoaXMuc2V0T2JqZWN0ID0gc2V0T2JqZWN0O1xuICAgIHRoaXMuZ2V0T2JqZWN0ID0gZ2V0T2JqZWN0O1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgXHQkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgXHRyZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2JqZWN0KGtleSwgdmFsdWUpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T2JqZWN0KGtleSkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCAne30nKTtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnU3RvcmFnZVNlcnZpY2UnLCBTdG9yYWdlU2VydmljZSk7XG5cbiAgU3RvcmFnZVNlcnZpY2UuJGluamVjdCA9IFtdO1xuXG4gIGZ1bmN0aW9uIFN0b3JhZ2VTZXJ2aWNlKCkge1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIHN0b3JhZ2VPYmplY3QgICAgICA9IHt9O1xuICAgIHN0b3JhZ2VPYmplY3Qub2JqZWN0cyAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0LmFycmF5cyAgID0ge307XG4gICAgc3RvcmFnZU9iamVjdC5zdHJpbmdzICA9IHt9O1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuc2V0T2JqZWN0ICAgICA9IHNldE9iamVjdDtcbiAgICB0aGlzLmdldE9iamVjdCAgICAgPSBnZXRPYmplY3Q7XG4gICAgdGhpcy5zZXRBcnJheSAgICAgID0gc2V0QXJyYXk7XG4gICAgdGhpcy5nZXRBcnJheSAgICAgID0gZ2V0QXJyYXk7XG4gICAgdGhpcy5zZXRTdHJpbmcgICAgID0gc2V0U3RyaW5nO1xuICAgIHRoaXMuZ2V0U3RyaW5nICAgICA9IGdldFN0cmluZztcbiAgICB0aGlzLmdldEFsbFN0b3JhZ2UgPSBnZXRBbGxTdG9yYWdlO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIHNldE9iamVjdChrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0Lm9iamVjdHNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldE9iamVjdChrZXkpIHtcblx0XHRcdHJldHVybiBzdG9yYWdlT2JqZWN0Lm9iamVjdHNba2V5XTtcblx0XHR9XG5cbiAgICBmdW5jdGlvbiBzZXRBcnJheShrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0LmFycmF5c1trZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXJyYXkoa2V5KSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdC5hcnJheXNba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRTdHJpbmcoa2V5LCB2YWx1ZSkge1xuICAgICAgc3RvcmFnZU9iamVjdC5zdHJpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdHJpbmcoa2V5KSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdC5zdHJpbmdzW2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWxsU3RvcmFnZSgpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0O1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=