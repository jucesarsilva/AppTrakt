/**
 * @function Factory config API for connection on
 * @author julio_c.silva@outlook.com
 * @since 28/10/2016
 */
(function () {

    'use strict';
    
    //default settings for API based in oauth 2.0
    var $apiSettingOptionsDefault = {
            URL_BASE: "https://trakt.tv",
            URL_API: "https://api.trakt.tv",
            URL_GET_CODE: null,
            URL_GET_AUTHENTICATION_EXCLUDED: "oauth",
            URL_GET_AUTHENTICATION_TOKEN: "/oauth/token",
            API_VERSION: 2,
            CLIENT_ID: "53feefa402e36ee5ba6dd1d4897bb1e013e5e02b1e7992873452dada213a8b44",
            CLIENT_SECRET: "4323ccb334c3e0e641c57373c1f9ce4ae36b7050934f07c22923b15a3d281b8c",
            CODE: null,
            REDIRECT_URI:"http://127.0.0.1:8000/",
            GRANT_TYPE: "client_credentials"
        };
    
    angular
        .module(modules.services)
        .provider("$apiSettingConfig", $apiSettingConfig)
        .factory('$apiSetting', $apiSetting)
        .constant("$apiSettingOptions", $apiSettingOptionsDefault);

    $apiSettingConfig.$inject = ['$apiSettingOptions'];
    $apiSetting.$inject = ['$apiSettingConfig'];

    function $apiSettingConfig($apiSettingOptions) {
        
        $apiSettingOptions.URL_GET_CODE = $apiSettingOptions.URL_BASE
        .concat("/oauth/authorize?response_type=code")
        .concat("&client_id=")
        .concat($apiSettingOptions.CLIENT_ID)
        .concat("&redirect_uri=")
        .concat($apiSettingOptions.REDIRECT_URI);
        
        var url_base = $apiSettingOptions.URL_BASE;
        var url_get_code = $apiSettingOptions.URL_GET_CODE;
        var url_get_authentication_excluded = $apiSettingOptions.URL_GET_AUTHENTICATION_EXCLUDED;
        var url_get_authentication_token = $apiSettingOptions.URL_API.concat($apiSettingOptions.URL_GET_AUTHENTICATION_TOKEN);
        var url_api = $apiSettingOptions.URL_API;
        var api_version = $apiSettingOptions.API_VERSION;
        var client_id = $apiSettingOptions.CLIENT_ID;
        var client_secret = $apiSettingOptions.CLIENT_SECRET;
        var code = $apiSettingOptions.CODE;
        var redirect_uri = $apiSettingOptions.REDIRECT_URI;
        var grant_type = $apiSettingOptions.GRANT_TYPE;
        
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setUrlBase = function __setUrlBase(_value) {
            url_base = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getUrlBase = function __getUrlBase() {
            return url_base;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setUrlGetCode = function __setUrlGetCode(_value) {
            url_get_code = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getUrlGetCode = function __getUrlGetCode() {
            return url_get_code;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setUrlGetAuthenticationExcluded = function __setUrlGetAuthenticationExcluded(_value) {
            url_get_authentication_excluded = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getUrlGetAuthenticationExcluded = function __getUrlGetAuthenticationExcluded() {
            return url_get_authentication_excluded;
        };

        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setUrlGetAuthenticationToken = function __setUrlGetAuthenticationToken(_value) {
            url_get_authentication_token = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getUrlGetAuthenticationToken = function __getUrlGetAuthenticationToken() {
            return url_get_authentication_token;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setUrlApi = function __setUrlApi(_value) {
            url_api = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getUrlApi = function __getUrlApi() {
            return url_api;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setApiVersion = function __setApiVersion(_value) {
            api_version = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getApiVersion = function __getApiVersion() {
            return api_version;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setClientId = function __setClientId(_value) {
            client_id = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getClientId = function __getClientId() {
            return client_id;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setClientSecret = function __setClientSecret(_value) {
            client_secret = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getClientSecret = function __getClientSecret() {
            return client_secret;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setCode = function __setCode(_value) {
            code = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getCode = function __getCode() {
            return code;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setRedirectURI = function __setRedirectURI(_value) {
            redirect_uri = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getRedirectURI = function __getRedirectURI() {
            return redirect_uri;
        };
        
        /**
         * @function Set
         * @param {String} _value
         * @returns
         */
        this.setGrantType = function __setGrantType(_value) {
            grant_type = _value;
        };

        /**
         * @function Get
         * @param
         * @returns {String}
         */
        this.getGrantType = function __getGrantType() {
            return grant_type;
        };

        /**
         * @description Get url params (query string)
         * @param
         * @returns {String}
         */
        this.getUrlParams = function __getUrlParams() {

            var query_string = {};
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = decodeURI(pair[1]);
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [query_string[pair[0]], pair[1]];
                    query_string[pair[0]] = arr;
                } else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        };

        // return provider
        this.$get = function () {
            return this;
        };
    };

    /**
     * @function Construtor
     * @param
     * @returns
     */
    function $apiSetting($apiSettingConfig) {

        return {
            url_base: $apiSettingConfig.getUrlBase(),
            url_get_code: $apiSettingConfig.getUrlGetCode(),
            url_get_authentication_excluded: $apiSettingConfig.getUrlGetAuthenticationExcluded(),
            url_get_authentication_token: $apiSettingConfig.getUrlGetAuthenticationToken(),
            url_api: $apiSettingConfig.getUrlApi(),
            api_version: $apiSettingConfig.getApiVersion(),
            client_id: $apiSettingConfig.getClientId(),
            client_secret: $apiSettingConfig.getClientSecret(),
            code: $apiSettingConfig.getCode(),
            redirect_uri: $apiSettingConfig.getRedirectURI(),
            grant_type: $apiSettingConfig.getGrantType()
        };
    };
})();