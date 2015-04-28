angular.module("diffr",["ngAnimate","ui.router","diffr.controllers","diffr.filters","diffr.config","diffr.directives","diffr.services","infinite-scroll"]),function(){"use strict";function e(e,t){e.state("search",{url:"/search",templateUrl:"templates/search.html",controller:"SearchCtrl",controllerAs:"search"}).state("compare",{url:"/compare",templateUrl:"templates/compare.html",controller:"CompareCtrl",controllerAs:"compare"}),t.otherwise("/search")}angular.module("diffr.config",[]),angular.module("diffr.config").config(e),e.$inject=["$stateProvider","$urlRouterProvider"]}(),function(){"use strict";function e(e,t){}angular.module("diffr.controllers",[]),angular.module("diffr.controllers").controller("AppCtrl",e),e.$inject=["$scope","$rootScope"]}(),function(){"use strict";function e(e,t,r,o,i){function c(){s.comparedPhotosList=r.isArrayDefined("comparedUrls")?a:[]}function n(e){var t=a.indexOf(e);a.splice(t,1),s.comparedPhotosList=a,r.setObject("comparedUrls",a)}var s=this,a=r.getObject("comparedUrls");s.removeComparedPhoto=n,c()}angular.module("diffr.controllers").controller("CompareCtrl",e),e.$inject=["$scope","$rootScope","LocalStorageService","FlickrService","StorageService"]}(),function(){"use strict";function e(e,t,r,o,i){function c(e,t){g||(h.searchedPhotos=e),h.searchedText=e,g=!1,h.searchedPhotosList=[],o.getSearchedPhotos(e,t).then(function(t){h.searchedPhotosList=t,-1===h.recentSearches.indexOf(e)&&h.recentSearches.push(e)})}function n(e,t){o.getSearchedPhotos(e,t).then(function(e){e.forEach(function(e){h.searchedPhotosList.push(e)})})}function s(e){c(e,20),h.showRecentsDropdown=!1}function a(){h.showRecentsDropdown=!h.showRecentsDropdown}function l(e){var t="https://farm"+e.farm+".staticflickr.com/"+e.server+"/"+e.id+"_"+e.secret+"_b.jpg";-1===p.indexOf(t)?(p.push(t),r.setObject("comparedUrls",p)):console.log("already in comparison list")}function f(){p=r.isArrayDefined("comparedUrls")?r.getObject("comparedUrls"):[]}function u(e){var t="https://farm"+e.farm+".staticflickr.com/"+e.server+"/"+e.id+"_"+e.secret+"_b.jpg";return-1===p.indexOf(t)?!0:!1}function d(){return r.isArrayDefined("comparedUrls")?!0:!1}var h=this;h.modelOptions={updateOn:"default blur",debounce:{"default":1e3,blur:0}},h.recentSearches=[],h.showRecentsDropdown=!1,h.searchedText="selfie";var p,g=!0;h.getSearchedPhotos=c,h.updatePhotos=s,h.toggleRecents=a,h.loadMorePhotos=n,h.addPhotoToCompare=l,h.showCompareButton=u,h.hasComparedPhotos=d,c("selfie",20),f()}angular.module("diffr.controllers").controller("SearchCtrl",e),e.$inject=["$scope","$rootScope","LocalStorageService","FlickrService","StorageService"]}(),function(){"use strict";function e(){return{restrict:"E",template:['<svg class="icon-add-photos" width="100%" height="100%" viewBox="-1 -1 31 25" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',"<title>Two photos stacked with an add icon in the corner</title>","<desc>Lets the user add a new photo to their list of compared images</desc>","<g class='svg-compare-icons'>","<g stroke-width='1'>","<path d='M0.118149935,4.50963844 L11.8374394,0.802704286 L18.1785857,17.7202619 L6.45929629,21.427196 L0.118149935,4.50963844 L0.118149935,4.50963844 Z'></path>","<path d='M18.0003708,0.243357633 L28.6245848,6.10760511 L18.5931005,21.44435 L7.96888653,15.5801025 L18.0003708,0.243357633 L18.0003708,0.243357633 Z'></path>","</g>","<g>",'<ellipse cx="5.54186573" cy="5.15083056" rx="5.54186573" ry="5.15083056"></ellipse>','<path d="M5.18820719,4.80797342 L5.18820719,2.40797342 L5.89552426,2.40797342 L5.89552426,4.80797342 L8.37113402,4.80797342 L8.37113402,5.49368771 L5.89552426,5.49368771',"L5.89552426,7.89368771",'L5.18820719,7.89368771 L5.18820719,5.49368771 L2.71259744,5.49368771 L2.71259744,4.80797342 L5.18820719,4.80797342 Z"></path>',"</g>","</g>","</svg>"].join("")}}angular.module("diffr.directives",[]),angular.module("diffr.directives").directive("iconAddCompare",e)}(),function(){"use strict";function e(){return function(e){return console.log(e),"undefined"!=typeof e?e.substring(0,1).toUpperCase()+e.substring(1):void 0}}angular.module("diffr.filters",[]),angular.module("diffr.filters").filter("capitalize",e)}(),function(){"use strict";function e(e,t){function r(r,i){var c=t.defer();return e.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+o+"&tags="+r+"&per_page="+i+"&format=json&nojsoncallback=1").success(function(e){c.resolve(e.photos.photo)}).error(function(e,t){console.log(e),c.reject(e)}),c.promise}var o="52ebcfc572066983269bf5140708086d";this.getSearchedPhotos=r}angular.module("diffr.services",[]),angular.module("diffr.services").service("FlickrService",e),e.$inject=["$http","$q"]}(),function(){"use strict";function e(e){function t(t,r){e.localStorage[t]=r}function r(t,r){return e.localStorage[t]||r}function o(t,r){e.localStorage[t]=JSON.stringify(r)}function i(t){return JSON.parse(e.localStorage[t]||"{}")}function c(t){var r=JSON.parse(e.localStorage[t]||"{}");return"undefined"!=typeof r[0]?!0:!1}this.set=t,this.get=r,this.setObject=o,this.getObject=i,this.isArrayDefined=c}angular.module("diffr.services").service("LocalStorageService",e),e.$inject=["$window"]}(),function(){"use strict";function e(){function e(e,t){s.objects[e]=t}function t(e){return s.objects[e]}function r(e,t){s.arrays[e]=t}function o(e){return s.arrays[e]}function i(e,t){s.strings[e]=t}function c(e){return s.strings[e]}function n(){return s}var s={};s.objects={},s.arrays={},s.strings={},this.setObject=e,this.getObject=t,this.setArray=r,this.getArray=o,this.setString=i,this.getString=c,this.getAllStorage=n}angular.module("diffr.services").service("StorageService",e),e.$inject=[]}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInJvdXRlLmNvbmZpZy5qcyIsImN0cmxzL2FwcC5jb250cm9sbGVyLmpzIiwiY3RybHMvY29tcGFyZS5jb250cm9sbGVyLmpzIiwiY3RybHMvc2VhcmNoLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL2RpcmVjdGl2ZXMuanMiLCJmaWx0ZXJzL2ZpbHRlcnMuanMiLCJzZXJ2aWNlcy9mbGlja3Iuc2VydmljZS5qcyIsInNlcnZpY2VzL2xvY2FsU3RvcmFnZS5zZXJ2aWNlLmpzIiwic2VydmljZXMvc3RvcmFnZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbImFuZ3VsYXIiLCJtb2R1bGUiLCJyb3V0ZUNvbmZpZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlclByb3ZpZGVyIiwic3RhdGUiLCJ1cmwiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXIiLCJjb250cm9sbGVyQXMiLCJvdGhlcndpc2UiLCJjb25maWciLCIkaW5qZWN0IiwiQXBwQ3RybCIsIiRzY29wZSIsIiRyb290U2NvcGUiLCJDb21wYXJlQ3RybCIsIkxvY2FsU3RvcmFnZVNlcnZpY2UiLCJGbGlja3JTZXJ2aWNlIiwiU3RvcmFnZVNlcnZpY2UiLCJnZXRDb21wYXJlZFBob3Rvc0xpc3QiLCJjb21wYXJlIiwiY29tcGFyZWRQaG90b3NMaXN0IiwiaXNBcnJheURlZmluZWQiLCJjb21wYXJlQXJyIiwicmVtb3ZlQ29tcGFyZWRQaG90byIsInVybEluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsInNldE9iamVjdCIsInRoaXMiLCJnZXRPYmplY3QiLCJTZWFyY2hDdHJsIiwiZ2V0U2VhcmNoZWRQaG90b3MiLCJ0ZXh0IiwiYW1vdW50IiwiaW5pdGlhbExvYWQiLCJzZWFyY2giLCJzZWFyY2hlZFBob3RvcyIsInNlYXJjaGVkVGV4dCIsInNlYXJjaGVkUGhvdG9zTGlzdCIsInRoZW4iLCJwaG90b3MiLCJyZWNlbnRTZWFyY2hlcyIsInB1c2giLCJsb2FkTW9yZVBob3RvcyIsImZvckVhY2giLCJlbGVtZW50IiwidXBkYXRlUGhvdG9zIiwibmV3VmFsdWUiLCJzaG93UmVjZW50c0Ryb3Bkb3duIiwidG9nZ2xlUmVjZW50cyIsImFkZFBob3RvVG9Db21wYXJlIiwicGhvdG8iLCJmYXJtIiwic2VydmVyIiwiaWQiLCJzZWNyZXQiLCJuZXdBcnJheSIsImNvbnNvbGUiLCJsb2ciLCJzaG93Q29tcGFyZUJ1dHRvbiIsImhhc0NvbXBhcmVkUGhvdG9zIiwibW9kZWxPcHRpb25zIiwidXBkYXRlT24iLCJkZWJvdW5jZSIsImRlZmF1bHQiLCJibHVyIiwiaWNvbkFkZENvbXBhcmUiLCJyZXN0cmljdCIsInRlbXBsYXRlIiwiam9pbiIsImRpcmVjdGl2ZSIsImNhcGl0YWxpemUiLCJpbnB1dCIsInN1YnN0cmluZyIsInRvVXBwZXJDYXNlIiwiZmlsdGVyIiwiJGh0dHAiLCIkcSIsImRlZmVyIiwiZ2V0IiwiZmxpY2tyS2V5Iiwic3VjY2VzcyIsImRhdGEiLCJyZXNvbHZlIiwiZXJyb3IiLCJzdGF0dXMiLCJyZWplY3QiLCJwcm9taXNlIiwic2VydmljZSIsIiR3aW5kb3ciLCJzZXQiLCJrZXkiLCJ2YWx1ZSIsImxvY2FsU3RvcmFnZSIsImRlZmF1bHRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZSIsImFyciIsInN0b3JhZ2VPYmplY3QiLCJvYmplY3RzIiwic2V0QXJyYXkiLCJhcnJheXMiLCJnZXRBcnJheSIsInNldFN0cmluZyIsInN0cmluZ3MiLCJnZXRTdHJpbmciLCJnZXRBbGxTdG9yYWdlIl0sIm1hcHBpbmdzIjoiQUFBQUEsUUFBQUMsT0FBQSxTQUNBLFlBQ0EsWUFDQSxvQkFDQSxnQkFDQSxlQUNBLG1CQUNBLGlCQUNBLG9CQ1JBLFdBQ0EsWUFRQSxTQUFBQyxHQUFBQyxFQUFBQyxHQU1BRCxFQUVBRSxNQUFBLFVBQ0FDLElBQUEsVUFDQUMsWUFBQSx3QkFDQUMsV0FBQSxhQUNBQyxhQUFBLFdBR0FKLE1BQUEsV0FDQUMsSUFBQSxXQUNBQyxZQUFBLHlCQUNBQyxXQUFB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RUFuQkE3RyxRQUFBQyxPQUFBLGtCQUFBeUYsUUFBQSxpQkFBQXZFLEdBRUFBLEVBQUFQIiwiZmlsZSI6ImRpZmZyLmFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdkaWZmcicsIFtcbiAgJ25nQW5pbWF0ZScsXG4gICd1aS5yb3V0ZXInLFxuICAnZGlmZnIuY29udHJvbGxlcnMnLFxuICAnZGlmZnIuZmlsdGVycycsXG4gICdkaWZmci5jb25maWcnLFxuICAnZGlmZnIuZGlyZWN0aXZlcycsXG4gICdkaWZmci5zZXJ2aWNlcycsXG4gICdpbmZpbml0ZS1zY3JvbGwnXG5dKTtcbiIsIihmdW5jdGlvbigpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbmZpZycsIFtdKTtcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29uZmlnJykuY29uZmlnKHJvdXRlQ29uZmlnKTtcblxuICByb3V0ZUNvbmZpZy4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInXTtcblxuICBmdW5jdGlvbiByb3V0ZUNvbmZpZygkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgLy8gSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gIC8vIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXItdWkvdWktcm91dGVyXG4gIC8vIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gIC8vIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAkc3RhdGVQcm92aWRlclxuXG4gIC5zdGF0ZSgnc2VhcmNoJywge1xuICAgIHVybDogXCIvc2VhcmNoXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3NlYXJjaC5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJTZWFyY2hDdHJsXCIsXG4gICAgY29udHJvbGxlckFzOiBcInNlYXJjaFwiLFxuICB9KVxuXG4gIC5zdGF0ZSgnY29tcGFyZScsIHtcbiAgICB1cmw6IFwiL2NvbXBhcmVcIixcbiAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvY29tcGFyZS5odG1sXCIsXG4gICAgY29udHJvbGxlcjogXCJDb21wYXJlQ3RybFwiLFxuICAgIGNvbnRyb2xsZXJBczogXCJjb21wYXJlXCIsXG4gIH0pO1xuXG4gIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9zZWFyY2gnKTtcbn1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycsIFtdKTtcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBcHBDdHJsJywgQXBwQ3RybCk7XG5cbiAgQXBwQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZSddO1xuXG4gIGZ1bmN0aW9uIEFwcEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlKSB7XG4gICAgdmFyIGFwcCA9IHRoaXM7XG5cbiAgICAvLyB2YXJpYWJsZXNcblxuICAgIC8vIG1ldGhvZHNcblxuICAgIC8vIGluaXRpYXRvcnNcblxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbXBhcmVDdHJsJywgQ29tcGFyZUN0cmwpO1xuXG4gIENvbXBhcmVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCAnRmxpY2tyU2VydmljZScsICdTdG9yYWdlU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIENvbXBhcmVDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgTG9jYWxTdG9yYWdlU2VydmljZSwgRmxpY2tyU2VydmljZSwgU3RvcmFnZVNlcnZpY2UpIHtcbiAgICB2YXIgY29tcGFyZSA9IHRoaXM7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICB2YXIgY29tcGFyZUFyciA9IExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0T2JqZWN0KCdjb21wYXJlZFVybHMnKTtcblxuICAgIC8vIG1ldGhvZHNcbiAgICBjb21wYXJlLnJlbW92ZUNvbXBhcmVkUGhvdG8gPSByZW1vdmVDb21wYXJlZFBob3RvO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuICAgIGdldENvbXBhcmVkUGhvdG9zTGlzdCgpO1xuXG5cblxuICAgIGZ1bmN0aW9uIGdldENvbXBhcmVkUGhvdG9zTGlzdCgpIHtcbiAgICAgIC8vIG5lZWQgdG8ga25vdyB3aGV0aGVyIHRoZSB1c2VyIGhhcyBwaG90b3Mgc2F2ZWQgb3Igbm90XG4gICAgICBpZihMb2NhbFN0b3JhZ2VTZXJ2aWNlLmlzQXJyYXlEZWZpbmVkKCdjb21wYXJlZFVybHMnKSkge1xuICAgICAgICBjb21wYXJlLmNvbXBhcmVkUGhvdG9zTGlzdCA9IGNvbXBhcmVBcnI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wYXJlLmNvbXBhcmVkUGhvdG9zTGlzdCA9IFtdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUNvbXBhcmVkUGhvdG8odXJsKSB7XG4gICAgICB2YXIgdXJsSW5kZXggPSBjb21wYXJlQXJyLmluZGV4T2YodXJsKTtcbiAgICAgIGNvbXBhcmVBcnIuc3BsaWNlKHVybEluZGV4LCAxKTtcbiAgICAgIGNvbXBhcmUuY29tcGFyZWRQaG90b3NMaXN0ID0gY29tcGFyZUFycjtcbiAgICAgIC8vIG1ha2Ugc3VyZSB0byB1cGRhdGUgTG9jYWxTdG9yYWdlIGFmdGVyIHdlJ3ZlIGFzc2lnbmVkIHRoZSBuZXcgYXJyYXkgdG8gc2NvcGVcbiAgICAgIExvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0T2JqZWN0KCdjb21wYXJlZFVybHMnLCBjb21wYXJlQXJyKTtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2VhcmNoQ3RybCcsIFNlYXJjaEN0cmwpO1xuXG4gIFNlYXJjaEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnTG9jYWxTdG9yYWdlU2VydmljZScsICdGbGlja3JTZXJ2aWNlJywgJ1N0b3JhZ2VTZXJ2aWNlJ107XG5cbiAgZnVuY3Rpb24gU2VhcmNoQ3RybCgkc2NvcGUsICRyb290U2NvcGUsIExvY2FsU3RvcmFnZVNlcnZpY2UsIEZsaWNrclNlcnZpY2UsIFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgdmFyIHNlYXJjaCA9IHRoaXM7XG5cbiAgICAvLyB2YXJpYWJsZXNcbiAgICBzZWFyY2gubW9kZWxPcHRpb25zID0ge1xuICAgICAgLy8gbmVlZCB0byBkZWJvdW5jZSB0aGUgbW9kZWwgZnJvbSB1cGRhdGluZ1xuICAgICAgLy8gc28gaXQgb25seSBnb2VzIHRvIGZsaWNrciBhcGkgd2hlbiB0aGUgdXNlclxuICAgICAgLy8gaXMgc3VyZSBhYm91dCB3aGF0IHRoZXkgYXJlIHNlYXJjaGluZyBmb3JcbiAgICAgIHVwZGF0ZU9uOiAnZGVmYXVsdCBibHVyJyxcbiAgICAgIGRlYm91bmNlOiB7XG4gICAgICAgICdkZWZhdWx0JzogMSAqIDEwMDAsXG4gICAgICAgICdibHVyJzogMFxuICAgICAgfVxuICAgIH07XG4gICAgc2VhcmNoLnJlY2VudFNlYXJjaGVzICAgICAgPSBbXTtcbiAgICBzZWFyY2guc2hvd1JlY2VudHNEcm9wZG93biA9IGZhbHNlO1xuICAgIHNlYXJjaC5zZWFyY2hlZFRleHQgICAgICAgID0gJ3NlbGZpZSc7XG4gICAgdmFyIGluaXRpYWxMb2FkICAgICAgICAgICAgPSB0cnVlO1xuICAgIHZhciBuZXdBcnJheTtcblxuICAgIC8vIG1ldGhvZHNcbiAgICBzZWFyY2guZ2V0U2VhcmNoZWRQaG90b3MgPSBnZXRTZWFyY2hlZFBob3RvcztcbiAgICBzZWFyY2gudXBkYXRlUGhvdG9zICAgICAgPSB1cGRhdGVQaG90b3M7XG4gICAgc2VhcmNoLnRvZ2dsZVJlY2VudHMgICAgID0gdG9nZ2xlUmVjZW50cztcbiAgICBzZWFyY2gubG9hZE1vcmVQaG90b3MgICAgPSBsb2FkTW9yZVBob3RvcztcbiAgICBzZWFyY2guYWRkUGhvdG9Ub0NvbXBhcmUgPSBhZGRQaG90b1RvQ29tcGFyZTtcbiAgICBzZWFyY2guc2hvd0NvbXBhcmVCdXR0b24gPSBzaG93Q29tcGFyZUJ1dHRvbjtcbiAgICBzZWFyY2guaGFzQ29tcGFyZWRQaG90b3MgPSBoYXNDb21wYXJlZFBob3RvcztcblxuICAgIC8vIGluaXRpYXRvcnNcbiAgICAvLyBpbml0aWFsbHkgbG9hZGluZyAyMCBwaG90b3Mgd2l0aCB0aGUgdGFnIHNlbGZpZVxuICAgIGdldFNlYXJjaGVkUGhvdG9zKCdzZWxmaWUnLCAyMCk7XG4gICAgZ2V0Q29tcGFyZWRQaG90b3NMaXN0KCk7XG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICBpZighaW5pdGlhbExvYWQpIHtcbiAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIHNlYXJjaC5zZWFyY2hlZFRleHQgPSB0ZXh0O1xuICAgICAgaW5pdGlhbExvYWQgPSBmYWxzZTtcbiAgICAgIHNlYXJjaC5zZWFyY2hlZFBob3Rvc0xpc3QgPSBbXTtcbiAgICAgIEZsaWNrclNlcnZpY2UuZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KS50aGVuKGZ1bmN0aW9uKHBob3Rvcykge1xuICAgICAgICBzZWFyY2guc2VhcmNoZWRQaG90b3NMaXN0ID0gcGhvdG9zO1xuICAgICAgICAvLyBkb250dCB3YW50IGR1cGxpY2F0ZXMgaW4gdGhlIG5nLXJlcGVhdCBmb3IgcmVjZW50IHNlYXJjaGVzXG4gICAgICAgIGlmKHNlYXJjaC5yZWNlbnRTZWFyY2hlcy5pbmRleE9mKHRleHQpID09PSAtMSkge1xuICAgICAgICAgIHNlYXJjaC5yZWNlbnRTZWFyY2hlcy5wdXNoKHRleHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkTW9yZVBob3Rvcyh0ZXh0LCBhbW91bnQpIHtcbiAgICAgIEZsaWNrclNlcnZpY2UuZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KS50aGVuKGZ1bmN0aW9uKHBob3Rvcykge1xuICAgICAgICAvLyBuZWVkIHRvIGFkZCBlYWNoIHBob3RvIHRvIHRoZSBlbmQgb2YgdGhlIHNlYXJjaGVkUGhvdG9zTGlzdCBhcnJheVxuICAgICAgICBwaG90b3MuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgc2VhcmNoLnNlYXJjaGVkUGhvdG9zTGlzdC5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVBob3RvcyhuZXdWYWx1ZSkge1xuICAgICAgLy8gZG9uJ3QgdXBkYXRlIHRoZSBwaG90b3Mgd2hlbiB0aGUgc2VhcmNoIGJhciBpcyBlbXB0eVxuICAgICAgaWYobmV3VmFsdWUgIT09ICcnIHx8IHR5cGVvZiBuZXdWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcgfHwgIWZhbHNlKSB7XG4gICAgICAgIGdldFNlYXJjaGVkUGhvdG9zKG5ld1ZhbHVlLCAyMCk7XG4gICAgICAgIHNlYXJjaC5zaG93UmVjZW50c0Ryb3Bkb3duID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlUmVjZW50cygpIHtcbiAgICAgIHNlYXJjaC5zaG93UmVjZW50c0Ryb3Bkb3duID0gIXNlYXJjaC5zaG93UmVjZW50c0Ryb3Bkb3duO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFBob3RvVG9Db21wYXJlKHBob3RvKSB7XG4gICAgICAvLyBuZWVkIHRvIGNvbnN0cnVjdCB0aGUgdW5pcXVlIHVybCBmb3IgdGhlIHBob3RvXG4gICAgICB2YXIgdXJsID0gJ2h0dHBzOi8vZmFybScgKyBwaG90by5mYXJtICsgJy5zdGF0aWNmbGlja3IuY29tLycgKyBwaG90by5zZXJ2ZXIgKyAnLycgKyBwaG90by5pZCArICdfJyArIHBob3RvLnNlY3JldCArICdfYi5qcGcnO1xuICAgICAgaWYobmV3QXJyYXkuaW5kZXhPZih1cmwpID09PSAtMSkge1xuICAgICAgICBuZXdBcnJheS5wdXNoKHVybCk7XG4gICAgICAgIExvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0T2JqZWN0KCdjb21wYXJlZFVybHMnLCBuZXdBcnJheSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnYWxyZWFkeSBpbiBjb21wYXJpc29uIGxpc3QnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb21wYXJlZFBob3Rvc0xpc3QoKSB7XG4gICAgICBpZihMb2NhbFN0b3JhZ2VTZXJ2aWNlLmlzQXJyYXlEZWZpbmVkKCdjb21wYXJlZFVybHMnKSkge1xuICAgICAgICBuZXdBcnJheSA9IExvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0T2JqZWN0KCdjb21wYXJlZFVybHMnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0FycmF5ID0gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd0NvbXBhcmVCdXR0b24ocGhvdG8pIHtcbiAgICAgIHZhciB1cmwgPSAnaHR0cHM6Ly9mYXJtJyArIHBob3RvLmZhcm0gKyAnLnN0YXRpY2ZsaWNrci5jb20vJyArIHBob3RvLnNlcnZlciArICcvJyArIHBob3RvLmlkICsgJ18nICsgcGhvdG8uc2VjcmV0ICsgJ19iLmpwZyc7XG4gICAgICAvLyBpZiB0aGUgcGhvdG8gaXMgYWxyZWFkeSBzYXZlZCwgZG9uJ3Qgc2hvdyB0aGUgYWRkIHRvIGNvbXBhcmUgYnRuXG4gICAgICBpZihuZXdBcnJheS5pbmRleE9mKHVybCkgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc0NvbXBhcmVkUGhvdG9zKCkge1xuICAgICAgLy8gb25seSBwdWxzZSB0aGUgY29tcGFyZSBwaG90b3MgbmF2IGJ1dHRvbiBpZiB0aGVyZSBhcmUgcGhvdG9zIHNhdmVkXG4gICAgICBpZihMb2NhbFN0b3JhZ2VTZXJ2aWNlLmlzQXJyYXlEZWZpbmVkKCdjb21wYXJlZFVybHMnKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLmRpcmVjdGl2ZXMnLCBbXSk7XG5cbiAgLy8gYWxsb3dzIHVzIHRvIHVzZSB0aGUgYmVuZWZpdHMgb2YgaW5saW5lIHN2Zywgd2l0aG91dCB0aGUgY2x1dHRlciBvZiB0aGUgbWFya3VwIGluIG91ciBodG1sXG4gIGZ1bmN0aW9uIGljb25BZGRDb21wYXJlKCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgdGVtcGxhdGU6IFtcbiAgICAgICc8c3ZnIGNsYXNzPVwiaWNvbi1hZGQtcGhvdG9zXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCItMSAtMSAzMSAyNVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIj4nLFxuICAgICAgICBcIjx0aXRsZT5Ud28gcGhvdG9zIHN0YWNrZWQgd2l0aCBhbiBhZGQgaWNvbiBpbiB0aGUgY29ybmVyPC90aXRsZT5cIixcbiAgICAgICAgXCI8ZGVzYz5MZXRzIHRoZSB1c2VyIGFkZCBhIG5ldyBwaG90byB0byB0aGVpciBsaXN0IG9mIGNvbXBhcmVkIGltYWdlczwvZGVzYz5cIixcbiAgICAgICAgLy8gdGFyZ2V0IHRoaXMgY2xhc3MgdG8gY2hhbmdlIGZpbGwsIHN0cm9rZSBjb2xvdXIgZXRjIGluIHRoZSBjc3NcbiAgICAgICAgXCI8ZyBjbGFzcz0nc3ZnLWNvbXBhcmUtaWNvbnMnPlwiLFxuICAgICAgICAgIFwiPGcgc3Ryb2tlLXdpZHRoPScxJz5cIixcbiAgICAgICAgICAgIFwiPHBhdGggZD0nTTAuMTE4MTQ5OTM1LDQuNTA5NjM4NDQgTDExLjgzNzQzOTQsMC44MDI3MDQyODYgTDE4LjE3ODU4NTcsMTcuNzIwMjYxOSBMNi40NTkyOTYyOSwyMS40MjcxOTYgTDAuMTE4MTQ5OTM1LDQuNTA5NjM4NDQgTDAuMTE4MTQ5OTM1LDQuNTA5NjM4NDQgWic+PC9wYXRoPlwiLFxuICAgICAgICAgICAgXCI8cGF0aCBkPSdNMTguMDAwMzcwOCwwLjI0MzM1NzYzMyBMMjguNjI0NTg0OCw2LjEwNzYwNTExIEwxOC41OTMxMDA1LDIxLjQ0NDM1IEw3Ljk2ODg4NjUzLDE1LjU4MDEwMjUgTDE4LjAwMDM3MDgsMC4yNDMzNTc2MzMgTDE4LjAwMDM3MDgsMC4yNDMzNTc2MzMgWic+PC9wYXRoPlwiLFxuICAgICAgICAgIFwiPC9nPlwiLFxuICAgICAgICAgIFwiPGc+XCIsXG4gICAgICAgICAgICAnPGVsbGlwc2UgY3g9XCI1LjU0MTg2NTczXCIgY3k9XCI1LjE1MDgzMDU2XCIgcng9XCI1LjU0MTg2NTczXCIgcnk9XCI1LjE1MDgzMDU2XCI+PC9lbGxpcHNlPicsXG4gICAgICAgICAgICAnPHBhdGggZD1cIk01LjE4ODIwNzE5LDQuODA3OTczNDIgTDUuMTg4MjA3MTksMi40MDc5NzM0MiBMNS44OTU1MjQyNiwyLjQwNzk3MzQyIEw1Ljg5NTUyNDI2LDQuODA3OTczNDIgTDguMzcxMTM0MDIsNC44MDc5NzM0MiBMOC4zNzExMzQwMiw1LjQ5MzY4NzcxIEw1Ljg5NTUyNDI2LDUuNDkzNjg3NzEnLCAnTDUuODk1NTI0MjYsNy44OTM2ODc3MScsICdMNS4xODgyMDcxOSw3Ljg5MzY4NzcxIEw1LjE4ODIwNzE5LDUuNDkzNjg3NzEgTDIuNzEyNTk3NDQsNS40OTM2ODc3MSBMMi43MTI1OTc0NCw0LjgwNzk3MzQyIEw1LjE4ODIwNzE5LDQuODA3OTczNDIgWlwiPjwvcGF0aD4nLFxuICAgICAgICAgICc8L2c+JyxcbiAgICAgICAgJzwvZz4nLFxuICAgICAgJzwvc3ZnPidcbiAgICAgIF0uam9pbignJylcbiAgICB9O1xuICB9XG5cbiAgYW5ndWxhclxuICAubW9kdWxlKCdkaWZmci5kaXJlY3RpdmVzJylcbiAgLmRpcmVjdGl2ZSgnaWNvbkFkZENvbXBhcmUnLCBpY29uQWRkQ29tcGFyZSk7XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuZmlsdGVycycsIFtdKTtcblxuICBmdW5jdGlvbiBjYXBpdGFsaXplKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgY29uc29sZS5sb2coaW5wdXQpO1xuICAgICAgaWYodHlwZW9mIGlucHV0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsMSkudG9VcHBlckNhc2UoKSArIGlucHV0LnN1YnN0cmluZygxKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2RpZmZyLmZpbHRlcnMnKVxuICAgIC5maWx0ZXIoJ2NhcGl0YWxpemUnLCBjYXBpdGFsaXplKTtcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycsIFtdKTtcblxuICBhbmd1bGFyLm1vZHVsZSgnZGlmZnIuc2VydmljZXMnKS5zZXJ2aWNlKCdGbGlja3JTZXJ2aWNlJywgRmxpY2tyU2VydmljZSk7XG5cbiAgLy8gbmVlZCB0aGUgaW5qZWN0IG1ldGhvZCBmb3IgbWluaWZpY2F0aW9uXG4gIEZsaWNrclNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnXTtcblxuICBmdW5jdGlvbiBGbGlja3JTZXJ2aWNlKCRodHRwLCAkcSkge1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIGZsaWNrcktleSA9ICc1MmViY2ZjNTcyMDY2OTgzMjY5YmY1MTQwNzA4MDg2ZCcsXG4gICAgZmxpY2tyU2VjcmV0ICA9ICdlOGQ1M2EyZmY3MGIxMDc3JztcblxuICAgIC8vIG1ldGhvZHNcbiAgICB0aGlzLmdldFNlYXJjaGVkUGhvdG9zID0gZ2V0U2VhcmNoZWRQaG90b3M7XG5cbiAgICAvLyBpbml0aWF0b3JzXG5cblxuXG4gICAgZnVuY3Rpb24gZ2V0U2VhcmNoZWRQaG90b3ModGV4dCwgYW1vdW50KSB7XG4gICAgICAvLyBuZWVkIHRvIHVzZSBhIHByb21pc2UgYmVjdWFzZSAkaHR0cCdzIHN1Y2Nlc3MgYW5kIGVycm9yIGNhbiBiZSB1bnJlbGlhYmxlXG4gICAgICB2YXIgZGVmZXIgPSAkcS5kZWZlcigpO1xuXG4gICAgICAkaHR0cC5nZXQoJ2h0dHBzOi8vYXBpLmZsaWNrci5jb20vc2VydmljZXMvcmVzdC8/bWV0aG9kPWZsaWNrci5waG90b3Muc2VhcmNoJmFwaV9rZXk9JyArIGZsaWNrcktleSArICcmdGFncz0nICsgdGV4dCArICcmcGVyX3BhZ2U9JyArIGFtb3VudCArICcmZm9ybWF0PWpzb24mbm9qc29uY2FsbGJhY2s9MScpXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGRlZmVyLnJlc29sdmUoZGF0YS5waG90b3MucGhvdG8pO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihlcnJvciwgc3RhdHVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgZGVmZXIucmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcblxuICAgIH1cblxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdkaWZmci5zZXJ2aWNlcycpLnNlcnZpY2UoJ0xvY2FsU3RvcmFnZVNlcnZpY2UnLCBMb2NhbFN0b3JhZ2VTZXJ2aWNlKTtcblxuICBMb2NhbFN0b3JhZ2VTZXJ2aWNlLiRpbmplY3QgPSBbJyR3aW5kb3cnXTtcblxuICBmdW5jdGlvbiBMb2NhbFN0b3JhZ2VTZXJ2aWNlKCR3aW5kb3cpIHtcblxuICAgIC8vIHZhcmlhYmxlc1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuc2V0ICAgICAgICAgICAgPSBzZXQ7XG4gICAgdGhpcy5nZXQgICAgICAgICAgICA9IGdldDtcbiAgICB0aGlzLnNldE9iamVjdCAgICAgID0gc2V0T2JqZWN0O1xuICAgIHRoaXMuZ2V0T2JqZWN0ICAgICAgPSBnZXRPYmplY3Q7XG4gICAgdGhpcy5pc0FycmF5RGVmaW5lZCA9IGlzQXJyYXlEZWZpbmVkO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgXHQkd2luZG93LmxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgXHRyZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2JqZWN0KGtleSwgdmFsdWUpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T2JqZWN0KGtleSkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2Vba2V5XSB8fCAne30nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5RGVmaW5lZChrZXkpIHtcbiAgICAgIHZhciBhcnIgPSBKU09OLnBhcnNlKCR3aW5kb3cubG9jYWxTdG9yYWdlW2tleV0gfHwgJ3t9Jyk7XG4gICAgICBpZih0eXBlb2YgYXJyWzBdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2RpZmZyLnNlcnZpY2VzJykuc2VydmljZSgnU3RvcmFnZVNlcnZpY2UnLCBTdG9yYWdlU2VydmljZSk7XG5cbiAgU3RvcmFnZVNlcnZpY2UuJGluamVjdCA9IFtdO1xuXG4gIGZ1bmN0aW9uIFN0b3JhZ2VTZXJ2aWNlKCkge1xuXG4gICAgLy8gdmFyaWFibGVzXG4gICAgdmFyIHN0b3JhZ2VPYmplY3QgICAgICA9IHt9O1xuICAgIHN0b3JhZ2VPYmplY3Qub2JqZWN0cyAgPSB7fTtcbiAgICBzdG9yYWdlT2JqZWN0LmFycmF5cyAgID0ge307XG4gICAgc3RvcmFnZU9iamVjdC5zdHJpbmdzICA9IHt9O1xuXG4gICAgLy8gbWV0aG9kc1xuICAgIHRoaXMuc2V0T2JqZWN0ICAgICA9IHNldE9iamVjdDtcbiAgICB0aGlzLmdldE9iamVjdCAgICAgPSBnZXRPYmplY3Q7XG4gICAgdGhpcy5zZXRBcnJheSAgICAgID0gc2V0QXJyYXk7XG4gICAgdGhpcy5nZXRBcnJheSAgICAgID0gZ2V0QXJyYXk7XG4gICAgdGhpcy5zZXRTdHJpbmcgICAgID0gc2V0U3RyaW5nO1xuICAgIHRoaXMuZ2V0U3RyaW5nICAgICA9IGdldFN0cmluZztcbiAgICB0aGlzLmdldEFsbFN0b3JhZ2UgPSBnZXRBbGxTdG9yYWdlO1xuXG4gICAgLy8gaW5pdGlhdG9yc1xuXG5cblxuICAgIGZ1bmN0aW9uIHNldE9iamVjdChrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0Lm9iamVjdHNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldE9iamVjdChrZXkpIHtcblx0XHRcdHJldHVybiBzdG9yYWdlT2JqZWN0Lm9iamVjdHNba2V5XTtcblx0XHR9XG5cbiAgICBmdW5jdGlvbiBzZXRBcnJheShrZXksIHZhbHVlKSB7XG4gICAgICBzdG9yYWdlT2JqZWN0LmFycmF5c1trZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXJyYXkoa2V5KSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdC5hcnJheXNba2V5XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRTdHJpbmcoa2V5LCB2YWx1ZSkge1xuICAgICAgc3RvcmFnZU9iamVjdC5zdHJpbmdzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTdHJpbmcoa2V5KSB7XG4gICAgICByZXR1cm4gc3RvcmFnZU9iamVjdC5zdHJpbmdzW2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWxsU3RvcmFnZSgpIHtcbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0O1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=