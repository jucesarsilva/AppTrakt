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
    
    MasterController.$inject = ['$scope', 'MasterRepository', 'ImageRepository', '$http', '$notification']
    
    function MasterController($scope, MasterRepository, ImageRepository, $http, $notification) {
          
        $scope.movies = [];
        $scope.currentPage = 1;
        $scope.pageSize = 4;
        $scope.limit = $scope.pageSize;
        $scope.loading = false;

        /**
         * @function load movies
         * @param
         * @returns
         */
        function loadMore(_pageSize) {
            $scope.loading = true;
            if(_pageSize) $scope.limit += _pageSize;
            MasterRepository.getMoviesPopular($scope.currentPage, $scope.limit)
            .success(function(data, status, headers, config){
                $scope.loading = false;
                addMovie(data)
                loadThumbs();
            })
            .error(function(data) {
                $scope.loading = false;
                console.log("Erro ao carregar os dados.", data);
            });
        };
        $scope.loadMore = loadMore;
        
        /**
         * @function add a movie into movies list
         * @param {int} id
         * @returns
         */
        function addMovie(list) {
            var diff = differenceMovies(list, $scope.movies);
            for(var a = 0; a < diff.length; a++)
                $scope.movies.push(diff[a]);
        };
        
        /**
         * @function get diff bettwen movie list and response list movie from server
         * @param {int} id
         * @returns
         */
        function differenceMovies(a,b) {
            var onlyInA = a.filter(function(current){
                return b.filter(function(current_b){
                    return current_b.title == current.title;
                }).length == 0;
            });
            var onlyInB = b.filter(function(current){
                return a.filter(function(current_a){
                    return current_a.title == current.title;
                }).length == 0;
            });
            return onlyInA.concat(onlyInB);
        }
        
        /**
         * @function get movie's images for movies that don't have it
         * @param {int} id
         * @returns
         */
        function loadThumbs() {
            for(var a = 0; a < $scope.movies.length; a++)
                if(!$scope.movies[a].images)
                    getImage($scope.movies[a]);
        };
        
        /**
         * @function get movie's images
         * @param {int} id
         * @returns
         */
        function getImage(movie) {
            ImageRepository.getImageResource(movie.ids.tmdb)
            .success(function(data, status, headers, config){
                movie.images = data;
                movie.loading = true;
                $('#movie_image_' + movie.ids.tmdb).on('load', function () {
                    movie.loading = false;
                    $scope.safeApply();
                }.bind(this));
            })
            .error(function(data) {
                console.log("Erro ao carregar os dados.", data);
            })
        };
        
        /**
         * @function force angular diggest
         * @param
         * @returns
         */
        $scope.safeApply = function __safeApply() {
            var $scope, fn, force = false;
            if (arguments.length === 1) {
                var arg = arguments[0];
                if (typeof arg === 'function') {
                    fn = arg;
                } else {
                    $scope = arg;
                }
            } else {
                $scope = arguments[0];
                fn = arguments[1];
                if (arguments.length === 3) {
                    force = !!arguments[2];
                }
            }
            $scope = $scope || this;
            fn = fn || function () { };

            if (force || !$scope.$$phase) {
                $scope.$apply ? $scope.$apply(fn) : $scope.apply(fn);
            } else {
                fn();
            }
        };
        
        loadMore();
    };

})();