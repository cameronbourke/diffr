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
