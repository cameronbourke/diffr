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
