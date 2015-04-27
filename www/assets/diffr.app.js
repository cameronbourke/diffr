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
      getSearchedPhotos(newValue, 20);
    }

    function toggleRecents() {
      search.showRecentsDropdown = !search.showRecentsDropdown;
    }

  }

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

      $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrKey + '&text=' + text + '&per_page=' + amount + '&format=json&nojsoncallback=1')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImRpcmVjdGl2ZXMvZGlyZWN0aXZlcy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiY3RybHMvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJzZXJ2aWNlcy9mbGlja3Iuc2VydmljZS5qcyIsInNlcnZpY2VzL2xvY2FsU3RvcmFnZS5zZXJ2aWNlLmpzIiwic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJkaWZmci5hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnZGlmZnInLCBbXG4gICduZ0FuaW1hdGUnLFxuICAndWkucm91dGVyJyxcbiAgJ2RpZmZyLmNvbnRyb2xsZXJzJyxcbiAgJ2RpZmZyLmZpbHRlcnMnLFxuICAnZGlmZnIuY29uZmlnJyxcbiAgJ2RpZmZyLmRpcmVjdGl2ZXMnLFxuICAnZGlmZnIuc2VydmljZXMnLFxuICAnaW5maW5pdGUtc2Nyb2xsJ1xuXSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5maWx0ZXJzJywgW10pO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29uZmlnJywgW10pO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb25maWcnKS5jb25maWcocm91dGVDb25maWcpO1xuXG4gIHJvdXRlQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuXG4gIGZ1bmN0aW9uIHJvdXRlQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gICRzdGF0ZVByb3ZpZGVyXG5cbiAgLnN0YXRlKCdzZWFyY2gnLCB7XG4gICAgdXJsOiBcIi9zZWFyY2hcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvc2VhcmNoLmh0bWxcIixcbiAgICBjb250cm9sbGVyOiBcIlNlYXJjaEN0cmxcIixcbiAgICBjb250cm9sbGVyQXM6IFwic2VhcmNoXCIsXG4gIH0pO1xuXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9zZWFyY2gnKTtcbn1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5kaXJlY3RpdmVzJywgW10pO1xuXG4gIGZ1bmN0aW9uIGljb25WaWV3UGhvdG9zKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlOiAnPHN2ZyB3aWR0aD1cIjE5cHhcIiBoZWlnaHQ9XCIxOXB4XCIgdmlld0JveD1cIjAgMCA0MTIgNDEyXCI+PHRpdGxlPmdlYXItaWNvbjwvdGl0bGU+PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+PGRlZnM+PC9kZWZzPicgK1xuICAgICAgICAnPGcgaWQ9XCJQYWdlLTFcIiBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIHNrZXRjaDp0eXBlPVwiTVNQYWdlXCI+JyArXG4gICAgICAgICAgJzxwYXRoIGQ9XCJNNDEyLDIzMy43NDIgTDQxMiwxNzguMjU3IEwzODIuMDE5LDE2Ny41OTUgQzM3MC41ODgsMTYzLjUzIDM2MS4zOTEsMTU0LjgwMSAzNTYuNzQ1LDE0My41OTQgQzM1Ni43NDMsMTQzLjU5IDM1Ni43NDEsMTQzLjU4NSAzNTYuNzM5LDE0My41ODEgQzM1Mi4wOCwxMzIuMzQ2IDM1Mi40MDYsMTE5LjY2MyAzNTcuNjI4LDEwOC42NzggTDM3MS4yODEsNzkuOTU0IEwzMzIuMDQ3LDQwLjcyIEwzMDMuMzI3LDU0LjM3MiBDMjkyLjM0OCw1OS41OTEgMjc5LjY0Nyw1OS45MTggMjY4LjQxOSw1NS4yNjEgQzI2OC40MTQsNTUuMjU5IDI2OC40MDksNTUuMjU4IDI2OC40MDUsNTUuMjU2IEMyNTcuMTksNTAuNjA2IDI0OC40NzIsNDEuNDIyIDI0NC40MDUsMjkuOTgzIEwyMzMuNzQxLDAgTDE3OC4yNTcsMCBMMTY3LjU5NSwyOS45ODEgQzE2My41Myw0MS40MTIgMTU0LjgwMSw1MC42MDggMTQzLjU5NCw1NS4yNTUgQzE0My41ODksNTUuMjU3IDE0My41ODUsNTUuMjU5IDE0My41OCw1NS4yNiBDMTMyLjM0NSw1OS45MiAxMTkuNjYxLDU5LjU5MyAxMDguNjc1LDU0LjM3MSBMNzkuOTUyLDQwLjcxOCBMNDAuNzE4LDc5Ljk1MiBMNTQuMzcxLDEwOC42NzMgQzU5LjU5LDExOS42NTIgNTkuOTE2LDEzMi4zNTQgNTUuMjYsMTQzLjU4MyBDNTUuMjU4LDE0My41ODcgNTUuMjU2LDE0My41OTIgNTUuMjU0LDE0My41OTYgQzUwLjYwNSwxNTQuODEgNDEuNDIsMTYzLjUyNyAyOS45ODMsMTY3LjU5NCBMMCwxNzguMjU3IEwwLDIzMy43NDIgTDI5Ljk4LDI0NC40MDMgQzQxLjQxMSwyNDguNDY4IDUwLjYwNywyNTcuMTk3IDU1LjI1NCwyNjguNDAzIEM1NS4yNTYsMjY4LjQwOCA1NS4yNTcsMjY4LjQxMyA1NS4yNTksMjY4LjQxNyBDNTkuOTE5LDI3OS42NTMgNTkuNTkzLDI5Mi4zMzggNTQuMzcxLDMwMy4zMjMgTDQwLjcxNywzMzIuMDQ2IEw3OS45NTEsMzcxLjI4IEwxMDguNjcyLDM1Ny42MjggQzExOS42NTEsMzUyLjQwOSAxMzIuMzUzLDM1Mi4wODIgMTQzLjU4MSwzNTYuNzM5IEMxNDMuNTg2LDM1Ni43NDEgMTQzLjU5MSwzNTYuNzQzIDE0My41OTUsMzU2Ljc0NSBDMTU0LjgwOSwzNjEuMzk0IDE2My41MjUsMzcwLjU3OCAxNjcuNTkzLDM4Mi4wMTYgTDE3OC4yNTcsNDEyIEwyMzMuNzQxLDQxMiBMMjQ0LjMzNiwzODIuMjEgQzI0OC40MzksMzcwLjY3MiAyNTcuMjQ0LDM2MS4zODYgMjY4LjU1MiwzNTYuNjg1IEMyNjguNTU3LDM1Ni42ODMgMjY4LjU2MSwzNTYuNjgxIDI2OC41NjYsMzU2LjY3OSBDMjc5LjY5MywzNTIuMDUxIDI5Mi4yNiwzNTIuMzY4IDMwMy4xNDQsMzU3LjU0MiBMMzMyLjA0NiwzNzEuMjggTDM3MS4yOCwzMzIuMDQ2IEwzNTcuNjIsMzAzLjMwOSBDMzUyLjQwNiwyOTIuMzQgMzUyLjA4MSwyNzkuNjUgMzU2LjczNCwyNjguNDMyIEMzNTYuNzM2LDI2OC40MjcgMzU2LjczOCwyNjguNDIzIDM1Ni43NCwyNjguNDE4IEMzNjEuMzk0LDI1Ny4xOTMgMzcwLjU4OCwyNDguNDY5IDM4Mi4wMzcsMjQ0LjM5NyBMNDEyLDIzMy43NDIgTDQxMiwyMzMuNzQyIFogTTIwNi4wMDEyNzQsMzAyLjI3MzUgQzE1Mi44Mjk4NDMsMzAyLjI3MzUgMTA5LjcyNTg2MywyNTkuMTcwNzk0IDEwOS43MjU4NjMsMjA2LjAwMDYzNyBDMTA5LjcyNTg2MywxNTIuODMwNDgxIDE1Mi44Mjk4NDMsMTA5LjcyNjUgMjA2LjAwMTI3NCwxMDkuNzI2NSBDMjU5LjE3MTQzMSwxMDkuNzI2NSAzMDIuMjc0MTM3LDE1Mi44MzA0ODEgMzAyLjI3NDEzNywyMDYuMDAwNjM3IEMzMDIuMjc0MTM3LDI1OS4xNzA3OTQgMjU5LjE3MTQzMSwzMDIuMjczNSAyMDYuMDAxMjc0LDMwMi4yNzM1IEwyMDYuMDAxMjc0LDMwMi4yNzM1IFpcIiBpZD1cImdlYXItaWNvblwiIGZpbGw9XCIjRkZGRkZGXCIgc2tldGNoOnR5cGU9XCJNU1NoYXBlR3JvdXBcIj48L3BhdGg+JyArXG4gICAgICAgICc8L2c+JyArXG4gICAgICAnPC9zdmc+J1xuICAgIH07XG4gIH1cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2RpZmZyLmRpcmVjdGl2ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ2ljb25WaWV3UGhvdG9zJywgaWNvblZpZXdQaG90b3MpO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQXBwQ3RybCcsIEFwcEN0cmwpO1xuXG4gIEFwcEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnXTtcblxuICBmdW5jdGlvbiBBcHBDdHJsKCRzY29wZSwgJHJvb3RTY29wZSkge1xuICAgIHZhciBhcHAgPSB0aGlzO1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZWFyY2hDdHJsJywgU2VhcmNoQ3RybCk7XG5cbiAgU2VhcmNoQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICdMb2NhbFN0b3JhZ2VTZXJ2aWNlJywgJ0ZsaWNrclNlcnZpY2UnLCAnU3RvcmFnZVNlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBTZWFyY2hDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgTG9jYWxTdG9yYWdlU2VydmljZSwgRmxpY2tyU2VydmljZSwgU3RvcmFnZVNlcnZpY2UpIHtcbiAgICB2YXIgc2VhcmNoID0gdGhpcztcblxuICAgIC8vIHZhcmlhYmxlc1xuICAgIHNlYXJjaC5tb2RlbE9wdGlvbnMgPSB7XG4gICAgICB1cGRhdGVPbjogJ2RlZmF1bHQgYmx1cicsXG4gICAgICBkZWJvdW5jZToge1xuICAgICAgICAnZGVmYXVsdCc6IDEgKiAxMDAwLFxuICAgICAgICAnYmx1cic6IDBcbiAgICAgIH1cbiAgICB9O1xuICAgIHNlYXJjaC5yZWNlbnRTZWFyY2hlcyAgICAgID0gU3RvcmFnZVNlcnZpY2UuZ2V0QXJyYXkoJ3JlY2VudFNlYXJjaGVzJykgfHwgW107XG4gICAgc2VhcmNoLnNob3dSZWNlbnRzRHJvcGRvd24gPSBmYWxzZTtcbiAgICB2YXIgaW5pdGlhbExvYWQgICAgICAgICAgICA9IHRydWU7XG4gICAgc2VhcmNoLnNlYXJjaGVkVGV4dCAgICAgICAgPSAnc2VsZmllJztcblxuICAgIC8vIG1ldGhvZHNcbiAgICBzZWFyY2guZ2V0U2VhcmNoZWRQaG90b3MgPSBnZXRTZWFyY2hlZFBob3RvcztcbiAgICBzZWFyY2gudXBkYXRlUGhvdG9zICAgICAgPSB1cGRhdGVQaG90b3M7XG4gICAgc2VhcmNoLnRvZ2dsZVJlY2VudHMgICAgID0gdG9nZ2xlUmVjZW50cztcbiAgICBzZWFyY2gubG9hZE1vcmVQaG90b3MgICAgPSBsb2FkTW9yZVBob3RvcztcblxuICAgIC8vIGluaXRpYXRvcnNcbiAgICBnZXRTZWFyY2hlZFBob3Rvcygnc2VsZmllJywgMjApO1xuXG5cblxuICAgIGZ1bmN0aW9uIGdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkge1xuICAgICAgaWYoIWluaXRpYWxMb2FkKSB7XG4gICAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3RvcyA9IHRleHQ7XG4gICAgICB9XG4gICAgICBzZWFyY2guc2VhcmNoZWRUZXh0ID0gdGV4dDtcbiAgICAgIGluaXRpYWxMb2FkID0gZmFsc2U7XG4gICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0ID0gW107XG4gICAgICBGbGlja3JTZXJ2aWNlLmdldFNlYXJjaGVkUGhvdG9zKHRleHQsIGFtb3VudCkudGhlbihmdW5jdGlvbihwaG90b3MpIHtcbiAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zTGlzdCA9IHBob3RvcztcbiAgICAgICAgaWYoc2VhcmNoLnJlY2VudFNlYXJjaGVzLmluZGV4T2YodGV4dCkgPT09IC0xKSB7XG4gICAgICAgICAgc2VhcmNoLnJlY2VudFNlYXJjaGVzLnB1c2godGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRNb3JlUGhvdG9zKHRleHQsIGFtb3VudCkge1xuICAgICAgRmxpY2tyU2VydmljZS5nZXRTZWFyY2hlZFBob3Rvcyh0ZXh0LCBhbW91bnQpLnRoZW4oZnVuY3Rpb24ocGhvdG9zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBob3Rvcyk7XG4gICAgICAgIHBob3Rvcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0LnB1c2goZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlUGhvdG9zKG5ld1ZhbHVlKSB7XG4gICAgICBnZXRTZWFyY2hlZFBob3RvcyhuZXdWYWx1ZSwgMjApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVJlY2VudHMoKSB7XG4gICAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9ICFzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93bjtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnRmxpY2tyU2VydmljZScsIEZsaWNrclNlcnZpY2UpO1xuXG4gIEZsaWNrclNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnXTtcblxuICBmdW5jdGlvbiBGbGlja3JTZXJ2aWNlKCRodHRwLCAkcSkge1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIGZsaWNrcktleSA9ICc1MmViY2ZjNTcyMDY2OTgzMjY5YmY1MTQwNzA4MDg2ZCcsXG4gICAgZmxpY2tyU2VjcmV0ICA9ICdlOGQ1M2EyZmY3MGIxMDc3JztcblxuICAgIC8vIG1ldGhvZHNcbiAgICB0aGlzLmdldFNlYXJjaGVkUGhvdG9zID0gZ2V0U2VhcmNoZWRQaG90b3M7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuXG4gICAgICAkaHR0cC5nZXQoJ2h0dHBzOi8vYXBpLmZsaWNrci5jb20vc2VydmljZXMvcmVzdC8/bWV0aG9kPWZsaWNrci5waG90b3Muc2VhcmNoJmFwaV9rZXk9JyArIGZsaWNrcktleSArICcmdGV4dD0nICsgdGV4dCArICcmcGVyX3BhZ2U9JyArIGFtb3VudCArICcmZm9ybWF0PWpzb24mbm9qc29uY2FsbGJhY2s9MScpXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGRlZmVyLnJlc29sdmUoZGF0YS5waG90b3MucGhvdG8pO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnJvciwgc3RhdHVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgZGVmZXIucmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcblxuICAgIH1cblxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycpLnNlcnZpY2UoJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlKTtcblxuICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLiRpbmplY3QgPSBbJyR3aW5kb3cnXTtcblxuICBmdW5jdGlvbiBMb2NhbFN0b3JhZ2VTZXJ2aWNlKCR3aW5kb3cpIHtcblxuICAgIC8vIHZhcmlhYmxlc1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuc2V0ID0gc2V0O1xuICAgIHRoaXMuZ2V0ID0gZ2V0O1xuICAgIHRoaXMuc2V0T2JqZWN0ID0gc2V0T2JqZWN0O1xuICAgIHRoaXMuZ2V0T2JqZWN0ID0gZ2V0T2JqZWN0O1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgXHQkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgXHRyZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2JqZWN0KGtleSwgdmFsdWUpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T2JqZWN0KGtleSkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCAne30nKTtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnU3RvcmFnZVNlcnZpY2UnLCBTdG9yYWdlU2VydmljZSk7XG5cbiAgU3RvcmFnZVNlcnZpY2UuJGluamVjdCA9IFtdO1xuXG4gIGZ1bmN0aW9uIFN0b3JhZ2VTZXJ2aWNlKCkge1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIHN0b3JhZ2VPYmplY3QgICAgICA9IHt9O1xuICAgIHN0b3JhZ2VPYmplY3Qub2JqZWN0cyAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0LmFycmF5cyAgID0ge307XG4gICAgc3RvcmFnZU9iamVjdC5zdHJpbmdzICA9IHt9O1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuc2V0T2JqZWN0ICAgICA9IHNldE9iamVjdDtcbiAgICB0aGlzLmdldE9iamVjdCAgICAgPSBnZXRPYmplY3Q7XG4gICAgdGhpcy5zZXRBcnJheSAgICAgID0gc2V0QXJyYXk7XG4gICAgdGhpcy5nZXRBcnJheSAgICAgID0gZ2V0QXJyYXk7XG4gICAgdGhpcy5zZXRTdHJpbmcgICAgID0gc2V0U3RyaW5nO1xuICAgIHRoaXMuZ2V0U3RyaW5nICAgICA9IGdldFN0cmluZztcbiAgICB0aGlzLmdldEFsbFN0b3JhZ2UgPSBnZXRBbGxTdG9yYWdlO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIHNldE9iamVjdChrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0Lm9iamVjdHNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldE9iamVjdChrZXkpIHtcblx0XHRcdHJldHVybiBzdG9yYWdlT2JqZWN0Lm9iamVjdHNba2V5XTtcblx0XHR9XG5cbiAgICBmdW5jdGlvbiBzZXRBcnJheShrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0LmFycmF5c1trZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXJyYXkoa2V5KSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdC5hcnJheXNba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRTdHJpbmcoa2V5LCB2YWx1ZSkge1xuICAgICAgc3RvcmFnZU9iamVjdC5zdHJpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdHJpbmcoa2V5KSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdC5zdHJpbmdzW2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWxsU3RvcmFnZSgpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0O1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=