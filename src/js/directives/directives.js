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
