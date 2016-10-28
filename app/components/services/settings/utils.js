/**
 * @function Utilidades
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function () {

    'use strict'

    angular
        .module('AppTrakt.services')
        .service('$util', Util);

    Util.$inject = ['$window'];

    function Util($window) {

        var app = {};

        app.internet_explorer = (function $internet_explorer() {

            var undef,
                v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');

            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );

            return v > 4 ? v : undef;

        }());

        app.Guid = function __Guid() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        };

        app.wrapHttpGetParameters = function __wrapHttpGetParameters(parameter) {

            var pack = {
                params: {}
            };

            if (typeof parameter === 'object') {

                for (var key in parameter) {

                    pack.params[key] = parameter[key];
                }
            }

            return pack;
        };

        app.wrapHttpPostParameters = function __wrapHttpPostParameters(parameter) {

            var pack = [];

            if (typeof parameter === 'object') {

                for (var key in parameter) {

                    pack.push(key + '=' + encodeURIComponent(parameter[key]));
                }
            }

            return pack.join('&');
        };

        app.wrapHttpPostHeader = function __wrapHttpPostHeader(token) {

            var _headers = {};

            _headers['Content-Type'] = 'application/x-www-form-urlencoded';
            _headers['__RequestVerificationToken'] = token || "no request verification token";

            return {
                headers: _headers
            };
        };

        app.getUrlParams = function __getUrlParams() {
            var query_string = {};
            var query = $window.location.search.substring(1);
            var vars = query.split("&");

            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = pair[1];
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [query_string[pair[0]], pair[1]];
                    query_string[pair[0]] = arr;
                } else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        };

        app.getWindowLocation = function __windowLocation(path) {
            var location = window.location;
            var origin = location.origin ? location.origin + "/" + path : location.protocol + "//" + location.host + "/" + path;
            return origin;
        };        

        app.HeaderSearch = function __HeaderSearch() {

            var btnSearch = document.getElementById("headerSearch_btn");

            btnSearch ? btnSearch.onclick = function () {

                var _keyword = document.getElementById("headerSearch_txt").value;

                _keyword != "" ? app.redirectTo("Project/Goal?keyword=" + encodeURIComponent(_keyword)) : app.redirectTo("Project/Goal?all=true");;

            } : null;
        };

        return app;
    };

})();