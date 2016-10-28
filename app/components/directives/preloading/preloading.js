/**
 * @function Carregamento por chamadas Ajax
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function __preloading(){

    'use strict';

    angular
        .module('AppTrakt.directives')
        .directive('ngShowLoading', $ngShowLoading)
        .directive('ngHideLoading', $ngHideLoading)
        .directive('preloading', $preloading);
    
    $preloading.$inject = [];
    $ngShowLoading.$inject = ['$animate', '$httpTransform'];
    $ngHideLoading.$inject = ['$animate', '$httpTransform'];
    
    function $preloading() {
        var template = '<div id="preloading" ng-show-loading class="ng-cloak loading-box"><label>{{message}}</label></div>';
        return {
            restrict: 'EA',
            transclude: true,
            scope: true,
            template: template,
            replace: true,
            link: function ($scope, elem, attrs) {
                $scope.message = attrs.message || 'Carregando...';
            }
        };
    };
    
    function $ngShowLoading($animate, $httpTransform) {
        return function (scope, elem) {
            scope.$watch(function () {
                return $httpTransform.loading();
            }, function (value) {
                $animate[!!value ? 'removeClass' : 'addClass'](elem, 'ng-hide');
            });
        };
    };
    
    function $ngHideLoading($animate, $httpTransform) {
        return function (scope, elem) {
            scope.$watch(function () {
                return $httpTransform.loading();
            }, function (value) {
                $animate[!!value ? 'addClass' : 'removeClass'](elem, 'ng-hide');
            });
        };
    };  
    
})();