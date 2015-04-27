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
    search.loadMorePhotos    = loadMorePhotos;

    // initiators
    getSearchedPhotos('selfie', 20);



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
      if(newValue !== '') {
        getSearchedPhotos(newValue, 20);
      }
    }

    function toggleRecents() {
      search.showRecentsDropdown = !search.showRecentsDropdown;
    }

  }

})();

(function() {
  'use strict';

  angular.module('diffr.directives', []);

  function iconViewPhotos() {
    return {
      restrict: 'E',
      replace: true,
      template: '<svg width="19px" height="19px" viewBox="0 0 412 412"><title>gear-icon</title><desc>Created with Sketch.</desc><defs></defs>' +
        '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">' +
          '<path d="M412,233.742 L412,178.257 L382.019,167.595 C370.588,163.53 361.391,154.801 356.745,143.594 C356.743,143.59 356.741,143.585 356.739,143.581 C352.08,132.346 352.406,119.663 357.628,108.678 L371.281,79.954 L332.047,40.72 L303.327,54.372 C292.348,59.591 279.647,59.918 268.419,55.261 C268.414,55.259 268.409,55.258 268.405,55.256 C257.19,50.606 248.472,41.422 244.405,29.983 L233.741,0 L178.257,0 L167.595,29.981 C163.53,41.412 154.801,50.608 143.594,55.255 C143.589,55.257 143.585,55.259 143.58,55.26 C132.345,59.92 119.661,59.593 108.675,54.371 L79.952,40.718 L40.718,79.952 L54.371,108.673 C59.59,119.652 59.916,132.354 55.26,143.583 C55.258,143.587 55.256,143.592 55.254,143.596 C50.605,154.81 41.42,163.527 29.983,167.594 L0,178.257 L0,233.742 L29.98,244.403 C41.411,248.468 50.607,257.197 55.254,268.403 C55.256,268.408 55.257,268.413 55.259,268.417 C59.919,279.653 59.593,292.338 54.371,303.323 L40.717,332.046 L79.951,371.28 L108.672,357.628 C119.651,352.409 132.353,352.082 143.581,356.739 C143.586,356.741 143.591,356.743 143.595,356.745 C154.809,361.394 163.525,370.578 167.593,382.016 L178.257,412 L233.741,412 L244.336,382.21 C248.439,370.672 257.244,361.386 268.552,356.685 C268.557,356.683 268.561,356.681 268.566,356.679 C279.693,352.051 292.26,352.368 303.144,357.542 L332.046,371.28 L371.28,332.046 L357.62,303.309 C352.406,292.34 352.081,279.65 356.734,268.432 C356.736,268.427 356.738,268.423 356.74,268.418 C361.394,257.193 370.588,248.469 382.037,244.397 L412,233.742 L412,233.742 Z M206.001274,302.2735 C152.829843,302.2735 109.725863,259.170794 109.725863,206.000637 C109.725863,152.830481 152.829843,109.7265 206.001274,109.7265 C259.171431,109.7265 302.274137,152.830481 302.274137,206.000637 C302.274137,259.170794 259.171431,302.2735 206.001274,302.2735 L206.001274,302.2735 Z" id="gear-icon" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>' +
        '</g>' +
      '</svg>'
    };
  }
  angular
    .module('diffr.directives')
    .directive('iconViewPhotos', iconViewPhotos);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiY3RybHMvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2RpcmVjdGl2ZXMuanMiLCJzZXJ2aWNlcy9mbGlja3Iuc2VydmljZS5qcyIsInNlcnZpY2VzL2xvY2FsU3RvcmFnZS5zZXJ2aWNlLmpzIiwic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZGlmZnIuYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2RpZmZyJywgW1xuICAnbmdBbmltYXRlJyxcbiAgJ3VpLnJvdXRlcicsXG4gICdkaWZmci5jb250cm9sbGVycycsXG4gICdkaWZmci5maWx0ZXJzJyxcbiAgJ2RpZmZyLmNvbmZpZycsXG4gICdkaWZmci5kaXJlY3RpdmVzJyxcbiAgJ2RpZmZyLnNlcnZpY2VzJyxcbiAgJ2luZmluaXRlLXNjcm9sbCdcbl0pO1xuXG5hbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnLCBbXSk7XG5hbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnLCBbXSk7XG5hbmd1bGFyLm1vZHVsZSgnZGlmZnIuZmlsdGVycycsIFtdKTtcbiIsIihmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbmZpZycsIFtdKTtcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29uZmlnJykuY29uZmlnKHJvdXRlQ29uZmlnKTtcblxuICByb3V0ZUNvbmZpZy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInXTtcblxuICBmdW5jdGlvbiByb3V0ZUNvbmZpZygkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgLy8gSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gIC8vIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gIC8vIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gIC8vIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAkc3RhdGVQcm92aWRlclxuXG4gIC5zdGF0ZSgnc2VhcmNoJywge1xuICAgIHVybDogXCIvc2VhcmNoXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3NlYXJjaC5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJTZWFyY2hDdHJsXCIsXG4gICAgY29udHJvbGxlckFzOiBcInNlYXJjaFwiLFxuICB9KTtcblxuICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvc2VhcmNoJyk7XG59XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBcHBDdHJsJywgQXBwQ3RybCk7XG5cbiAgQXBwQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZSddO1xuXG4gIGZ1bmN0aW9uIEFwcEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG4gICAgdmFyIGFwcCA9IHRoaXM7XG5cbiAgICAvLyB2YXJpYWJsZXNcblxuICAgIC8vIG1ldGhvZHNcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NlYXJjaEN0cmwnLCBTZWFyY2hDdHJsKTtcblxuICBTZWFyY2hDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnRmxpY2tyU2VydmljZScsICdTdG9yYWdlU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIFNlYXJjaEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlLCBGbGlja3JTZXJ2aWNlLCBTdG9yYWdlU2VydmljZSkge1xuICAgIHZhciBzZWFyY2ggPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgc2VhcmNoLm1vZGVsT3B0aW9ucyA9IHtcbiAgICAgIHVwZGF0ZU9uOiAnZGVmYXVsdCBibHVyJyxcbiAgICAgIGRlYm91bmNlOiB7XG4gICAgICAgICdkZWZhdWx0JzogMSAqIDEwMDAsXG4gICAgICAgICdibHVyJzogMFxuICAgICAgfVxuICAgIH07XG4gICAgc2VhcmNoLnJlY2VudFNlYXJjaGVzICAgICAgPSBTdG9yYWdlU2VydmljZS5nZXRBcnJheSgncmVjZW50U2VhcmNoZXMnKSB8fCBbXTtcbiAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9IGZhbHNlO1xuICAgIHZhciBpbml0aWFsTG9hZCAgICAgICAgICAgID0gdHJ1ZTtcbiAgICBzZWFyY2guc2VhcmNoZWRUZXh0ICAgICAgICA9ICdzZWxmaWUnO1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHNlYXJjaC5nZXRTZWFyY2hlZFBob3RvcyA9IGdldFNlYXJjaGVkUGhvdG9zO1xuICAgIHNlYXJjaC51cGRhdGVQaG90b3MgICAgICA9IHVwZGF0ZVBob3RvcztcbiAgICBzZWFyY2gudG9nZ2xlUmVjZW50cyAgICAgPSB0b2dnbGVSZWNlbnRzO1xuICAgIHNlYXJjaC5sb2FkTW9yZVBob3RvcyAgICA9IGxvYWRNb3JlUGhvdG9zO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuICAgIGdldFNlYXJjaGVkUGhvdG9zKCdzZWxmaWUnLCAyMCk7XG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICBpZighaW5pdGlhbExvYWQpIHtcbiAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIHNlYXJjaC5zZWFyY2hlZFRleHQgPSB0ZXh0O1xuICAgICAgaW5pdGlhbExvYWQgPSBmYWxzZTtcbiAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QgPSBbXTtcbiAgICAgIEZsaWNrclNlcnZpY2UuZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KS50aGVuKGZ1bmN0aW9uKHBob3Rvcykge1xuICAgICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0ID0gcGhvdG9zO1xuICAgICAgICBpZihzZWFyY2gucmVjZW50U2VhcmNoZXMuaW5kZXhPZih0ZXh0KSA9PT0gLTEpIHtcbiAgICAgICAgICBzZWFyY2gucmVjZW50U2VhcmNoZXMucHVzaCh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZE1vcmVQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICBGbGlja3JTZXJ2aWNlLmdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkudGhlbihmdW5jdGlvbihwaG90b3MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocGhvdG9zKTtcbiAgICAgICAgcGhvdG9zLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QucHVzaChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVQaG90b3MobmV3VmFsdWUpIHtcbiAgICAgIGlmKG5ld1ZhbHVlICE9PSAnJykge1xuICAgICAgICBnZXRTZWFyY2hlZFBob3RvcyhuZXdWYWx1ZSwgMjApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVJlY2VudHMoKSB7XG4gICAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9ICFzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93bjtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbiAgZnVuY3Rpb24gaWNvblZpZXdQaG90b3MoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgdGVtcGxhdGU6ICc8c3ZnIHdpZHRoPVwiMTlweFwiIGhlaWdodD1cIjE5cHhcIiB2aWV3Qm94PVwiMCAwIDQxMiA0MTJcIj48dGl0bGU+Z2Vhci1pY29uPC90aXRsZT48ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz48ZGVmcz48L2RlZnM+JyArXG4gICAgICAgICc8ZyBpZD1cIlBhZ2UtMVwiIHN0cm9rZT1cIm5vbmVcIiBzdHJva2Utd2lkdGg9XCIxXCIgZmlsbD1cIm5vbmVcIiBmaWxsLXJ1bGU9XCJldmVub2RkXCIgc2tldGNoOnR5cGU9XCJNU1BhZ2VcIj4nICtcbiAgICAgICAgICAnPHBhdGggZD1cIk00MTIsMjMzLjc0MiBMNDEyLDE3OC4yNTcgTDM4Mi4wMTksMTY3LjU5NSBDMzcwLjU4OCwxNjMuNTMgMzYxLjM5MSwxNTQuODAxIDM1Ni43NDUsMTQzLjU5NCBDMzU2Ljc0MywxNDMuNTkgMzU2Ljc0MSwxNDMuNTg1IDM1Ni43MzksMTQzLjU4MSBDMzUyLjA4LDEzMi4zNDYgMzUyLjQwNiwxMTkuNjYzIDM1Ny42MjgsMTA4LjY3OCBMMzcxLjI4MSw3OS45NTQgTDMzMi4wNDcsNDAuNzIgTDMwMy4zMjcsNTQuMzcyIEMyOTIuMzQ4LDU5LjU5MSAyNzkuNjQ3LDU5LjkxOCAyNjguNDE5LDU1LjI2MSBDMjY4LjQxNCw1NS4yNTkgMjY4LjQwOSw1NS4yNTggMjY4LjQwNSw1NS4yNTYgQzI1Ny4xOSw1MC42MDYgMjQ4LjQ3Miw0MS40MjIgMjQ0LjQwNSwyOS45ODMgTDIzMy43NDEsMCBMMTc4LjI1NywwIEwxNjcuNTk1LDI5Ljk4MSBDMTYzLjUzLDQxLjQxMiAxNTQuODAxLDUwLjYwOCAxNDMuNTk0LDU1LjI1NSBDMTQzLjU4OSw1NS4yNTcgMTQzLjU4NSw1NS4yNTkgMTQzLjU4LDU1LjI2IEMxMzIuMzQ1LDU5LjkyIDExOS42NjEsNTkuNTkzIDEwOC42NzUsNTQuMzcxIEw3OS45NTIsNDAuNzE4IEw0MC43MTgsNzkuOTUyIEw1NC4zNzEsMTA4LjY3MyBDNTkuNTksMTE5LjY1MiA1OS45MTYsMTMyLjM1NCA1NS4yNiwxNDMuNTgzIEM1NS4yNTgsMTQzLjU4NyA1NS4yNTYsMTQzLjU5MiA1NS4yNTQsMTQzLjU5NiBDNTAuNjA1LDE1NC44MSA0MS40MiwxNjMuNTI3IDI5Ljk4MywxNjcuNTk0IEwwLDE3OC4yNTcgTDAsMjMzLjc0MiBMMjkuOTgsMjQ0LjQwMyBDNDEuNDExLDI0OC40NjggNTAuNjA3LDI1Ny4xOTcgNTUuMjU0LDI2OC40MDMgQzU1LjI1NiwyNjguNDA4IDU1LjI1NywyNjguNDEzIDU1LjI1OSwyNjguNDE3IEM1OS45MTksMjc5LjY1MyA1OS41OTMsMjkyLjMzOCA1NC4zNzEsMzAzLjMyMyBMNDAuNzE3LDMzMi4wNDYgTDc5Ljk1MSwzNzEuMjggTDEwOC42NzIsMzU3LjYyOCBDMTE5LjY1MSwzNTIuNDA5IDEzMi4zNTMsMzUyLjA4MiAxNDMuNTgxLDM1Ni43MzkgQzE0My41ODYsMzU2Ljc0MSAxNDMuNTkxLDM1Ni43NDMgMTQzLjU5NSwzNTYuNzQ1IEMxNTQuODA5LDM2MS4zOTQgMTYzLjUyNSwzNzAuNTc4IDE2Ny41OTMsMzgyLjAxNiBMMTc4LjI1Nyw0MTIgTDIzMy43NDEsNDEyIEwyNDQuMzM2LDM4Mi4yMSBDMjQ4LjQzOSwzNzAuNjcyIDI1Ny4yNDQsMzYxLjM4NiAyNjguNTUyLDM1Ni42ODUgQzI2OC41NTcsMzU2LjY4MyAyNjguNTYxLDM1Ni42ODEgMjY4LjU2NiwzNTYuNjc5IEMyNzkuNjkzLDM1Mi4wNTEgMjkyLjI2LDM1Mi4zNjggMzAzLjE0NCwzNTcuNTQyIEwzMzIuMDQ2LDM3MS4yOCBMMzcxLjI4LDMzMi4wNDYgTDM1Ny42MiwzMDMuMzA5IEMzNTIuNDA2LDI5Mi4zNCAzNTIuMDgxLDI3OS42NSAzNTYuNzM0LDI2OC40MzIgQzM1Ni43MzYsMjY4LjQyNyAzNTYuNzM4LDI2OC40MjMgMzU2Ljc0LDI2OC40MTggQzM2MS4zOTQsMjU3LjE5MyAzNzAuNTg4LDI0OC40NjkgMzgyLjAzNywyNDQuMzk3IEw0MTIsMjMzLjc0MiBMNDEyLDIzMy43NDIgWiBNMjA2LjAwMTI3NCwzMDIuMjczNSBDMTUyLjgyOTg0MywzMDIuMjczNSAxMDkuNzI1ODYzLDI1OS4xNzA3OTQgMTA5LjcyNTg2MywyMDYuMDAwNjM3IEMxMDkuNzI1ODYzLDE1Mi44MzA0ODEgMTUyLjgyOTg0MywxMDkuNzI2NSAyMDYuMDAxMjc0LDEwOS43MjY1IEMyNTkuMTcxNDMxLDEwOS43MjY1IDMwMi4yNzQxMzcsMTUyLjgzMDQ4MSAzMDIuMjc0MTM3LDIwNi4wMDA2MzcgQzMwMi4yNzQxMzcsMjU5LjE3MDc5NCAyNTkuMTcxNDMxLDMwMi4yNzM1IDIwNi4wMDEyNzQsMzAyLjI3MzUgTDIwNi4wMDEyNzQsMzAyLjI3MzUgWlwiIGlkPVwiZ2Vhci1pY29uXCIgZmlsbD1cIiNGRkZGRkZcIiBza2V0Y2g6dHlwZT1cIk1TU2hhcGVHcm91cFwiPjwvcGF0aD4nICtcbiAgICAgICAgJzwvZz4nICtcbiAgICAgICc8L3N2Zz4nXG4gICAgfTtcbiAgfVxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnZGlmZnIuZGlyZWN0aXZlcycpXG4gICAgLmRpcmVjdGl2ZSgnaWNvblZpZXdQaG90b3MnLCBpY29uVmlld1Bob3Rvcyk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdGbGlja3JTZXJ2aWNlJywgRmxpY2tyU2VydmljZSk7XG5cbiAgRmxpY2tyU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckcSddO1xuXG4gIGZ1bmN0aW9uIEZsaWNrclNlcnZpY2UoJGh0dHAsICRxKSB7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICB2YXIgZmxpY2tyS2V5ID0gJzUyZWJjZmM1NzIwNjY5ODMyNjliZjUxNDA3MDgwODZkJyxcbiAgICBmbGlja3JTZWNyZXQgID0gJ2U4ZDUzYTJmZjcwYjEwNzcnO1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuZ2V0U2VhcmNoZWRQaG90b3MgPSBnZXRTZWFyY2hlZFBob3RvcztcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG5cbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hlZFBob3Rvcyh0ZXh0LCBhbW91bnQpIHtcbiAgICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICRodHRwLmdldCgnaHR0cHM6Ly9hcGkuZmxpY2tyLmNvbS9zZXJ2aWNlcy9yZXN0Lz9tZXRob2Q9ZmxpY2tyLnBob3Rvcy5zZWFyY2gmYXBpX2tleT0nICsgZmxpY2tyS2V5ICsgJyZ0YWdzPScgKyB0ZXh0ICsgJyZwZXJfcGFnZT0nICsgYW1vdW50ICsgJyZmb3JtYXQ9anNvbiZub2pzb25jYWxsYmFjaz0xJylcbiAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgZGVmZXIucmVzb2x2ZShkYXRhLnBob3Rvcy5waG90byk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycm9yLCBzdGF0dXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICBkZWZlci5yZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xuXG4gICAgfVxuXG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnTG9jYWxTdG9yYWdlU2VydmljZScsIExvY2FsU3RvcmFnZVNlcnZpY2UpO1xuXG4gIExvY2FsU3RvcmFnZVNlcnZpY2UuJGluamVjdCA9IFsnJHdpbmRvdyddO1xuXG4gIGZ1bmN0aW9uIExvY2FsU3RvcmFnZVNlcnZpY2UoJHdpbmRvdykge1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG4gICAgdGhpcy5zZXQgPSBzZXQ7XG4gICAgdGhpcy5nZXQgPSBnZXQ7XG4gICAgdGhpcy5zZXRPYmplY3QgPSBzZXRPYmplY3Q7XG4gICAgdGhpcy5nZXRPYmplY3QgPSBnZXRPYmplY3Q7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICBcdCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQoa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICBcdHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPYmplY3Qoa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPYmplY3Qoa2V5KSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdTdG9yYWdlU2VydmljZScsIFN0b3JhZ2VTZXJ2aWNlKTtcblxuICBTdG9yYWdlU2VydmljZS4kaW5qZWN0ID0gW107XG5cbiAgZnVuY3Rpb24gU3RvcmFnZVNlcnZpY2UoKSB7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICB2YXIgc3RvcmFnZU9iamVjdCAgICAgID0ge307XG4gICAgc3RvcmFnZU9iamVjdC5vYmplY3RzICA9IHt9O1xuICAgIHN0b3JhZ2VPYmplY3QuYXJyYXlzICAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0LnN0cmluZ3MgID0ge307XG5cbiAgICAvLyBtZXRob2RzXG4gICAgdGhpcy5zZXRPYmplY3QgICAgID0gc2V0T2JqZWN0O1xuICAgIHRoaXMuZ2V0T2JqZWN0ICAgICA9IGdldE9iamVjdDtcbiAgICB0aGlzLnNldEFycmF5ICAgICAgPSBzZXRBcnJheTtcbiAgICB0aGlzLmdldEFycmF5ICAgICAgPSBnZXRBcnJheTtcbiAgICB0aGlzLnNldFN0cmluZyAgICAgPSBzZXRTdHJpbmc7XG4gICAgdGhpcy5nZXRTdHJpbmcgICAgID0gZ2V0U3RyaW5nO1xuICAgIHRoaXMuZ2V0QWxsU3RvcmFnZSA9IGdldEFsbFN0b3JhZ2U7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gc2V0T2JqZWN0KGtleSwgdmFsdWUpIHtcbiAgICAgIHN0b3JhZ2VPYmplY3Qub2JqZWN0c1trZXldID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0T2JqZWN0KGtleSkge1xuXHRcdFx0cmV0dXJuIHN0b3JhZ2VPYmplY3Qub2JqZWN0c1trZXldO1xuXHRcdH1cblxuICAgIGZ1bmN0aW9uIHNldEFycmF5KGtleSwgdmFsdWUpIHtcbiAgICAgIHN0b3JhZ2VPYmplY3QuYXJyYXlzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBcnJheShrZXkpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0LmFycmF5c1trZXldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFN0cmluZyhrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0LnN0cmluZ3Nba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0cmluZyhrZXkpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0LnN0cmluZ3Nba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRBbGxTdG9yYWdlKCkge1xuICAgICAgcmV0dXJuIHN0b3JhZ2VPYmplY3Q7XG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==