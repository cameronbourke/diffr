angular.module('diffr', [
  'ngAnimate',
  'ui.router',
  'diffr.controllers',
  'diffr.filters',
  'diffr.config',
  'diffr.directives',
  'diffr.services'
]);

angular.module('diffr.controllers', []);
angular.module('diffr.services', []);
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
  // $stateProvider
  //
  // // setup an abstract state for the tabs directive
  // .state('tab', {
  //   url: "/tab",
  //   abstract: true,
  //   templateUrl: "templates/tabs.html",
  //   controller: "TabCtrl"
  // })
  //
  // // Each tab has its own nav history stack:
  //
  // .state('tab.recents', {
  //   url: '/recents',
  //   views: {
  //     'tab-recents': {
  //       templateUrl: 'templates/tab-recents.html',
  //       controller: 'RecentsCtrl'
  //     }
  //   }
  // })
  //
  // .state('tab.gotem', {
  //   url: '/gotem',
  //   views: {
  //     'tab-gotem': {
  //       templateUrl: 'templates/tab-gotem.html',
  //       controller: 'GotEmCtrl'
  //     }
  //   }
  // })
  //
  // .state('tab.verses', {
  //   url: '/verses',
  //   views: {
  //     'tab-verses': {
  //       templateUrl: 'templates/tab-verses.html',
  //       controller: 'VersesCtrl'
  //     }
  //   }
  // })
  //
  // .state('login', {
  //   url: '/login',
  //   templateUrl: 'templates/login.html',
  //   controller: 'LoginCtrl as login',
  // })
  //
  // .state('tab.recents-challengeDetail', {
  //   url: '/challengeDetail',
  //   views: {
  //     'tab-recents': {
  //       templateUrl: 'templates/challengeDetail.html',
  //       controller: 'ChallengeDetailCtrl'
  //     }
  //   }
  // })
  //
  // .state('tab.recents-replyOwnChallenge', {
  //   url: '/replyOwnChallenge',
  //   views: {
  //     'tab-recents': {
  //       templateUrl: 'templates/replyOwnChallenge.html',
  //       controller: 'ReplyOwnChallengeCtrl'
  //     }
  //   }
  // })
  //
  // .state('tab.recents-revealChallenge', {
  //   url: '/revealChallenge',
  //   views: {
  //     'tab-recents': {
  //       templateUrl: 'templates/revealChallenge.html',
  //       controller: 'RevealChallengeCtrl'
  //     }
  //   }
  // });
  //
  // // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/recents');
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
    var storageObject     = {};
    storageObject.objects = {};

    // methods
    this.set = set;
    this.get = get;

    // initiators



    function set(key, value) {
			objectsService.objects[key] = value;
		}

		function get(key) {
			return objectsService.objects[key];
		}

  }

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiZGlyZWN0aXZlcy9kaXJlY3RpdmVzLmpzIiwic2VydmljZXMvbG9jYWxTdG9yYWdlLnNlcnZpY2UuanMiLCJzZXJ2aWNlcy9zdG9yYWdlLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZGlmZnIuYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ2RpZmZyJywgW1xuICAnbmdBbmltYXRlJyxcbiAgJ3VpLnJvdXRlcicsXG4gICdkaWZmci5jb250cm9sbGVycycsXG4gICdkaWZmci5maWx0ZXJzJyxcbiAgJ2RpZmZyLmNvbmZpZycsXG4gICdkaWZmci5kaXJlY3RpdmVzJyxcbiAgJ2RpZmZyLnNlcnZpY2VzJ1xuXSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycsIFtdKTtcbmFuZ3VsYXIubW9kdWxlKCdkaWZmci5maWx0ZXJzJywgW10pO1xuIiwiKGZ1bmN0aW9uKCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29uZmlnJywgW10pO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb25maWcnKS5jb25maWcocm91dGVDb25maWcpO1xuXG4gIHJvdXRlQ29uZmlnLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuXG4gIGZ1bmN0aW9uIHJvdXRlQ29uZmlnKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgLy8gU2V0IHVwIHRoZSB2YXJpb3VzIHN0YXRlcyB3aGljaCB0aGUgYXBwIGNhbiBiZSBpbi5cbiAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gIC8vICRzdGF0ZVByb3ZpZGVyXG4gIC8vXG4gIC8vIC8vIHNldHVwIGFuIGFic3RyYWN0IHN0YXRlIGZvciB0aGUgdGFicyBkaXJlY3RpdmVcbiAgLy8gLnN0YXRlKCd0YWInLCB7XG4gIC8vICAgdXJsOiBcIi90YWJcIixcbiAgLy8gICBhYnN0cmFjdDogdHJ1ZSxcbiAgLy8gICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvdGFicy5odG1sXCIsXG4gIC8vICAgY29udHJvbGxlcjogXCJUYWJDdHJsXCJcbiAgLy8gfSlcbiAgLy9cbiAgLy8gLy8gRWFjaCB0YWIgaGFzIGl0cyBvd24gbmF2IGhpc3Rvcnkgc3RhY2s6XG4gIC8vXG4gIC8vIC5zdGF0ZSgndGFiLnJlY2VudHMnLCB7XG4gIC8vICAgdXJsOiAnL3JlY2VudHMnLFxuICAvLyAgIHZpZXdzOiB7XG4gIC8vICAgICAndGFiLXJlY2VudHMnOiB7XG4gIC8vICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3RhYi1yZWNlbnRzLmh0bWwnLFxuICAvLyAgICAgICBjb250cm9sbGVyOiAnUmVjZW50c0N0cmwnXG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9KVxuICAvL1xuICAvLyAuc3RhdGUoJ3RhYi5nb3RlbScsIHtcbiAgLy8gICB1cmw6ICcvZ290ZW0nLFxuICAvLyAgIHZpZXdzOiB7XG4gIC8vICAgICAndGFiLWdvdGVtJzoge1xuICAvLyAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy90YWItZ290ZW0uaHRtbCcsXG4gIC8vICAgICAgIGNvbnRyb2xsZXI6ICdHb3RFbUN0cmwnXG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9KVxuICAvL1xuICAvLyAuc3RhdGUoJ3RhYi52ZXJzZXMnLCB7XG4gIC8vICAgdXJsOiAnL3ZlcnNlcycsXG4gIC8vICAgdmlld3M6IHtcbiAgLy8gICAgICd0YWItdmVyc2VzJzoge1xuICAvLyAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy90YWItdmVyc2VzLmh0bWwnLFxuICAvLyAgICAgICBjb250cm9sbGVyOiAnVmVyc2VzQ3RybCdcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vIH0pXG4gIC8vXG4gIC8vIC5zdGF0ZSgnbG9naW4nLCB7XG4gIC8vICAgdXJsOiAnL2xvZ2luJyxcbiAgLy8gICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9sb2dpbi5odG1sJyxcbiAgLy8gICBjb250cm9sbGVyOiAnTG9naW5DdHJsIGFzIGxvZ2luJyxcbiAgLy8gfSlcbiAgLy9cbiAgLy8gLnN0YXRlKCd0YWIucmVjZW50cy1jaGFsbGVuZ2VEZXRhaWwnLCB7XG4gIC8vICAgdXJsOiAnL2NoYWxsZW5nZURldGFpbCcsXG4gIC8vICAgdmlld3M6IHtcbiAgLy8gICAgICd0YWItcmVjZW50cyc6IHtcbiAgLy8gICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvY2hhbGxlbmdlRGV0YWlsLmh0bWwnLFxuICAvLyAgICAgICBjb250cm9sbGVyOiAnQ2hhbGxlbmdlRGV0YWlsQ3RybCdcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vIH0pXG4gIC8vXG4gIC8vIC5zdGF0ZSgndGFiLnJlY2VudHMtcmVwbHlPd25DaGFsbGVuZ2UnLCB7XG4gIC8vICAgdXJsOiAnL3JlcGx5T3duQ2hhbGxlbmdlJyxcbiAgLy8gICB2aWV3czoge1xuICAvLyAgICAgJ3RhYi1yZWNlbnRzJzoge1xuICAvLyAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9yZXBseU93bkNoYWxsZW5nZS5odG1sJyxcbiAgLy8gICAgICAgY29udHJvbGxlcjogJ1JlcGx5T3duQ2hhbGxlbmdlQ3RybCdcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vIH0pXG4gIC8vXG4gIC8vIC5zdGF0ZSgndGFiLnJlY2VudHMtcmV2ZWFsQ2hhbGxlbmdlJywge1xuICAvLyAgIHVybDogJy9yZXZlYWxDaGFsbGVuZ2UnLFxuICAvLyAgIHZpZXdzOiB7XG4gIC8vICAgICAndGFiLXJlY2VudHMnOiB7XG4gIC8vICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3JldmVhbENoYWxsZW5nZS5odG1sJyxcbiAgLy8gICAgICAgY29udHJvbGxlcjogJ1JldmVhbENoYWxsZW5nZUN0cmwnXG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9KTtcbiAgLy9cbiAgLy8gLy8gaWYgbm9uZSBvZiB0aGUgYWJvdmUgc3RhdGVzIGFyZSBtYXRjaGVkLCB1c2UgdGhpcyBhcyB0aGUgZmFsbGJhY2tcbiAgLy8gJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3RhYi9yZWNlbnRzJyk7XG59XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBcHBDdHJsJywgQXBwQ3RybCk7XG5cbiAgQXBwQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZSddO1xuXG4gIGZ1bmN0aW9uIEFwcEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG4gICAgdmFyIGFwcCA9IHRoaXM7XG5cbiAgICAvLyB2YXJpYWJsZXNcblxuICAgIC8vIG1ldGhvZHNcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5kaXJlY3RpdmVzJywgW10pO1xuXG4gIGZ1bmN0aW9uIGljb25WaWV3UGhvdG9zKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlOiAnPHN2ZyB3aWR0aD1cIjE5cHhcIiBoZWlnaHQ9XCIxOXB4XCIgdmlld0JveD1cIjAgMCA0MTIgNDEyXCI+PHRpdGxlPmdlYXItaWNvbjwvdGl0bGU+PGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+PGRlZnM+PC9kZWZzPicgK1xuICAgICAgICAnPGcgaWQ9XCJQYWdlLTFcIiBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiIHNrZXRjaDp0eXBlPVwiTVNQYWdlXCI+JyArXG4gICAgICAgICAgJzxwYXRoIGQ9XCJNNDEyLDIzMy43NDIgTDQxMiwxNzguMjU3IEwzODIuMDE5LDE2Ny41OTUgQzM3MC41ODgsMTYzLjUzIDM2MS4zOTEsMTU0LjgwMSAzNTYuNzQ1LDE0My41OTQgQzM1Ni43NDMsMTQzLjU5IDM1Ni43NDEsMTQzLjU4NSAzNTYuNzM5LDE0My41ODEgQzM1Mi4wOCwxMzIuMzQ2IDM1Mi40MDYsMTE5LjY2MyAzNTcuNjI4LDEwOC42NzggTDM3MS4yODEsNzkuOTU0IEwzMzIuMDQ3LDQwLjcyIEwzMDMuMzI3LDU0LjM3MiBDMjkyLjM0OCw1OS41OTEgMjc5LjY0Nyw1OS45MTggMjY4LjQxOSw1NS4yNjEgQzI2OC40MTQsNTUuMjU5IDI2OC40MDksNTUuMjU4IDI2OC40MDUsNTUuMjU2IEMyNTcuMTksNTAuNjA2IDI0OC40NzIsNDEuNDIyIDI0NC40MDUsMjkuOTgzIEwyMzMuNzQxLDAgTDE3OC4yNTcsMCBMMTY3LjU5NSwyOS45ODEgQzE2My41Myw0MS40MTIgMTU0LjgwMSw1MC42MDggMTQzLjU5NCw1NS4yNTUgQzE0My41ODksNTUuMjU3IDE0My41ODUsNTUuMjU5IDE0My41OCw1NS4yNiBDMTMyLjM0NSw1OS45MiAxMTkuNjYxLDU5LjU5MyAxMDguNjc1LDU0LjM3MSBMNzkuOTUyLDQwLjcxOCBMNDAuNzE4LDc5Ljk1MiBMNTQuMzcxLDEwOC42NzMgQzU5LjU5LDExOS42NTIgNTkuOTE2LDEzMi4zNTQgNTUuMjYsMTQzLjU4MyBDNTUuMjU4LDE0My41ODcgNTUuMjU2LDE0My41OTIgNTUuMjU0LDE0My41OTYgQzUwLjYwNSwxNTQuODEgNDEuNDIsMTYzLjUyNyAyOS45ODMsMTY3LjU5NCBMMCwxNzguMjU3IEwwLDIzMy43NDIgTDI5Ljk4LDI0NC40MDMgQzQxLjQxMSwyNDguNDY4IDUwLjYwNywyNTcuMTk3IDU1LjI1NCwyNjguNDAzIEM1NS4yNTYsMjY4LjQwOCA1NS4yNTcsMjY4LjQxMyA1NS4yNTksMjY4LjQxNyBDNTkuOTE5LDI3OS42NTMgNTkuNTkzLDI5Mi4zMzggNTQuMzcxLDMwMy4zMjMgTDQwLjcxNywzMzIuMDQ2IEw3OS45NTEsMzcxLjI4IEwxMDguNjcyLDM1Ny42MjggQzExOS42NTEsMzUyLjQwOSAxMzIuMzUzLDM1Mi4wODIgMTQzLjU4MSwzNTYuNzM5IEMxNDMuNTg2LDM1Ni43NDEgMTQzLjU5MSwzNTYuNzQzIDE0My41OTUsMzU2Ljc0NSBDMTU0LjgwOSwzNjEuMzk0IDE2My41MjUsMzcwLjU3OCAxNjcuNTkzLDM4Mi4wMTYgTDE3OC4yNTcsNDEyIEwyMzMuNzQxLDQxMiBMMjQ0LjMzNiwzODIuMjEgQzI0OC40MzksMzcwLjY3MiAyNTcuMjQ0LDM2MS4zODYgMjY4LjU1MiwzNTYuNjg1IEMyNjguNTU3LDM1Ni42ODMgMjY4LjU2MSwzNTYuNjgxIDI2OC41NjYsMzU2LjY3OSBDMjc5LjY5MywzNTIuMDUxIDI5Mi4yNiwzNTIuMzY4IDMwMy4xNDQsMzU3LjU0MiBMMzMyLjA0NiwzNzEuMjggTDM3MS4yOCwzMzIuMDQ2IEwzNTcuNjIsMzAzLjMwOSBDMzUyLjQwNiwyOTIuMzQgMzUyLjA4MSwyNzkuNjUgMzU2LjczNCwyNjguNDMyIEMzNTYuNzM2LDI2OC40MjcgMzU2LjczOCwyNjguNDIzIDM1Ni43NCwyNjguNDE4IEMzNjEuMzk0LDI1Ny4xOTMgMzcwLjU4OCwyNDguNDY5IDM4Mi4wMzcsMjQ0LjM5NyBMNDEyLDIzMy43NDIgTDQxMiwyMzMuNzQyIFogTTIwNi4wMDEyNzQsMzAyLjI3MzUgQzE1Mi44Mjk4NDMsMzAyLjI3MzUgMTA5LjcyNTg2MywyNTkuMTcwNzk0IDEwOS43MjU4NjMsMjA2LjAwMDYzNyBDMTA5LjcyNTg2MywxNTIuODMwNDgxIDE1Mi44Mjk4NDMsMTA5LjcyNjUgMjA2LjAwMTI3NCwxMDkuNzI2NSBDMjU5LjE3MTQzMSwxMDkuNzI2NSAzMDIuMjc0MTM3LDE1Mi44MzA0ODEgMzAyLjI3NDEzNywyMDYuMDAwNjM3IEMzMDIuMjc0MTM3LDI1OS4xNzA3OTQgMjU5LjE3MTQzMSwzMDIuMjczNSAyMDYuMDAxMjc0LDMwMi4yNzM1IEwyMDYuMDAxMjc0LDMwMi4yNzM1IFpcIiBpZD1cImdlYXItaWNvblwiIGZpbGw9XCIjRkZGRkZGXCIgc2tldGNoOnR5cGU9XCJNU1NoYXBlR3JvdXBcIj48L3BhdGg+JyArXG4gICAgICAgICc8L2c+JyArXG4gICAgICAnPC9zdmc+J1xuICAgIH07XG4gIH1cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2RpZmZyLmRpcmVjdGl2ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ2ljb25WaWV3UGhvdG9zJywgaWNvblZpZXdQaG90b3MpO1xuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnTG9jYWxTdG9yYWdlU2VydmljZScsIExvY2FsU3RvcmFnZVNlcnZpY2UpO1xuXG4gIExvY2FsU3RvcmFnZVNlcnZpY2UuJGluamVjdCA9IFsnJHdpbmRvdyddO1xuXG4gIGZ1bmN0aW9uIExvY2FsU3RvcmFnZVNlcnZpY2UoJHdpbmRvdykge1xuXG4gICAgLy8gdmFyaWFibGVzXG5cbiAgICAvLyBtZXRob2RzXG4gICAgdGhpcy5zZXQgPSBzZXQ7XG4gICAgdGhpcy5nZXQgPSBnZXQ7XG4gICAgdGhpcy5zZXRPYmplY3QgPSBzZXRPYmplY3Q7XG4gICAgdGhpcy5nZXRPYmplY3QgPSBnZXRPYmplY3Q7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICBcdCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXQoa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICBcdHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPYmplY3Qoa2V5LCB2YWx1ZSkge1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPYmplY3Qoa2V5KSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldIHx8ICd7fScpO1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdTdG9yYWdlU2VydmljZScsIFN0b3JhZ2VTZXJ2aWNlKTtcblxuICBTdG9yYWdlU2VydmljZS4kaW5qZWN0ID0gW107XG5cbiAgZnVuY3Rpb24gU3RvcmFnZVNlcnZpY2UoKSB7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICB2YXIgc3RvcmFnZU9iamVjdCAgICAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0Lm9iamVjdHMgPSB7fTtcblxuICAgIC8vIG1ldGhvZHNcbiAgICB0aGlzLnNldCA9IHNldDtcbiAgICB0aGlzLmdldCA9IGdldDtcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG5cbiAgICBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuXHRcdFx0b2JqZWN0c1NlcnZpY2Uub2JqZWN0c1trZXldID0gdmFsdWU7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0KGtleSkge1xuXHRcdFx0cmV0dXJuIG9iamVjdHNTZXJ2aWNlLm9iamVjdHNba2V5XTtcblx0XHR9XG5cbiAgfVxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9