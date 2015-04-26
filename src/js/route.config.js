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
