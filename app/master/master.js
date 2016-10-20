/**
 * @function controller for Master
 * @param
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function __MasterController(){
    
    'use strict';

    angular.module('AppTrakt.master', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/master', {
        templateUrl: 'master/master.html',
        controller: 'MasterController'
      });
    }])

    .controller('MasterController', MasterController);
    
    MasterController.$inject = ['$scope', 'ConfigRepository']
    
    function MasterController($scope, ConfigRepository) {
        
        /*
        ConfigRepository.getAuth(function(result){
            console.log(result);
        }, function(result){
            console.log(result);
        });
        */
    };
    
})();