/**
 * @function controller for Detail
 * @param
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function __DetailController(){
    
    'use strict';

    angular.module('AppTrakt.detail', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/detail', {
        templateUrl: 'detail/detail.html',
        controller: 'DetailController'
      });
    }])
    
    .controller('DetailController', DetailController);
       
    DetailController.$inject = ['$scope'];
    
    function DetailController($scope) {

    };
    
})();