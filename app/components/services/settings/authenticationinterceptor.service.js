/**
 * @function Interceptador de request para configuração de cabeçalho de autenticação via token
 * @author julio_c.silva@outlook.com
 * @since 28/10/2016.
 */
(function () {

    'use strict';

    angular
        .module(modules.services)
        .provider('$httpTransform', $httpTransform)
        .factory('$authenticationInterceptor', $authenticationInterceptor)
        .config($config);
    
    
    $authenticationInterceptor.$inject = ['$q', '$injector', '$httpTransform', '$apiSetting'];
    $config.$inject = ['$httpProvider', '$httpTransformProvider', '$locationProvider', '$provide'];
    
    /**
     * @function Provider
     * @param
     * @returns
     */
    function $httpTransform() {

        var loading = false,
            in_progress = 0;

        return {
            load: function () {
                loading = true;
                in_progress++;
            },
            $get: function () {
                return {
                    loading: function () {
                        return loading;
                    },
                    stop: function () {
                        in_progress--;
                        if (in_progress <= 0) {
                            loading = false;
                        }
                    }
                };
            }
        };
    };

    /**
     * Construtor
     * @param $q
     * @param $injector
     * @returns
     */
    function $authenticationInterceptor($q, $injector, $httpTransform, $apiSetting) {

        //Constantes de configuração da factory
        var constants = {
            AUTHENTICATIONTOKEN: 'authenticationtoken'
        };

        //Controle interno de Mecânica
        var controll = {
            authentication_on_progress: false
        };

        //Obter os componentes utilizados internamente na factory: 'interceptação do request'
        var components = {
            $http: undefined,
            ipCookie: undefined,
            $q: undefined,
            $notification: undefined,
            $apiSetting: undefined,
            loaded: false
        };

        //Objeto token
        var token = {
            access_token: undefined,
            expires_in: undefined,
            expires: undefined,
            statusCode: undefined,
            token_type: undefined,
            domain: undefined,
            secure: true,
            expirationUnit: undefined
        };

        //Fila de promessas
        var queue = [];

        //Configuração da Factory
        var factory = {
            constants: constants,
            controll: controll,
            components: components,
            token: token,
            request: request,
            response: response,
            responseError: responseError,
            getPager: getPager,
            setPagerHeader: setPagerHeader,
            getReturn: getReturn,
            queue: queue,
            executeQueue: executeQueue,
            clearQueue: clearQueue,
            deleteExpiredCookie: deleteExpiredCookie,
            getAuthenticationToken: getAuthenticationToken,
            setAuthenticationToken: setAuthenticationToken,
            setAuthenticationHeader: setAuthenticationHeader,
            setAuthenticationCookie: setAuthenticationCookie,
            getAuthenticationCookie: getAuthenticationCookie,
            existAuthenticationToken: existAuthenticationToken,
            isAuthenticationRequest: isAuthenticationRequest,
            formatAuthenticationToken: formatAuthenticationToken,
            getAuthenticationCookieExpiration: getAuthenticationCookieExpiration
        };

        /**
         * @function Interceptador de request
         * @param config
         * @returns
         */
        function request(config) {  
            config.headers["Content-Type"] = "application/json";
            if(config.url.match($apiSetting.url_api) != null) {
                config.headers["Trakt-Api-Key"] = $apiSetting.client_id;
                config.headers["Trakt-Api-Version"] = $apiSetting.api_version;
            }
            if (!factory.components.loaded) {
                factory.components.loaded = true;
                factory.components.$http = $injector.get('$apiSetting');
                factory.components.$http = $injector.get('$http');
                factory.components.ipCookie = $injector.get('ipCookie');
                factory.components.$q = $injector.get('$q');
                factory.components.$notification = $injector.get('$notification');
            }
            $httpTransform.loading();
            if (config.url.match($apiSetting.url_api) == null || 
                !$apiSetting.url_get_authentication_token || 
                !$apiSetting.url_get_authentication_excluded || 
                !$apiSetting.code) {
                return config || $q.when(config);
            }
            //Ignora o request da url 'Account/GetAuthenticationToken'
            if (factory.isAuthenticationRequest(config)) {
                $httpTransform.stop();
                return config || $q.when(config);
            }
            //Caso algum navegador não exclua o cookie de autenticação, o sistema o fará 
            factory.deleteExpiredCookie();
            //GET/UPDATE token
            if (!factory.existAuthenticationToken()) {
                if (!factory.controll.authentication_on_progress)
                    factory.getAuthenticationToken();
            }
            else {
                var cookie = factory.getAuthenticationCookie();
                factory.token = cookie.token;
            }
            //Autorização de cabeçalho
            config = factory.setAuthenticationHeader(config);
            //Retorno de promisse
            return factory.getReturn($q, config);
        };

        /**
         * @function Obter objeto que controla paginação (service pager.js)
         * @param {object} config
         * @returns
         */
        function getPager(config) {
            if (config.params)
                return config.params.$pager;
        };

        /**
         * @function Set objeto que controla paginação (service pager.js)
         * @param {object} config
         * @returns
         */
        function setPagerHeader(config) {
           angular.extend(config.headers, {
               TotalItens: config.params.$pager.totalItens,
               CurrentPage: config.params.$pager.currentPage,
               PageSize: config.params.$pager.pageSize,
               SortField: config.params.$pager.sortField,
               SortDir: config.params.$pager.sortDir
           });
           delete config.params.$pager;
           config.hasPager = true;
       };

        /**
         * @function - depois de cada resposta completa, desbloqueia o próximo request.
         * @params - response
         * @returns
         */
        function response(response) {
            $httpTransform.stop();
            return response;
        };

        /**
         * @function - depois de cada responta de erro, desbloqueia o próximo request.
         * @param - responseError
         * @returns
         */
        function responseError(responseError) {
            $httpTransform.stop();
            switch (responseError.status) {
                case 0:
                    factory.components.$notification.error("Requisição atingiu o tempo limite.");
                break;
                case 412:
                    factory.components.$notification.error("Pré condição de requisição falhou.");
                break;
                case 500:
                    factory.components.$notification.error("Erro interno no servidor");
                break;
                case 404:
                    factory.components.$notification.error("Não foram encontrados dados.");
                break;
                case 401:
                    factory.components.$notification.error("Erro na autenticação do request.");
                break;
                default:
                    factory.components.$notification.error("Ocorreu um erro inesperado.");
            }
            return factory.components.$q.reject(responseError);
        };

        /**
         * @function Realiza o retorno do request ou, armazenas os resquest em uma fila até que o request do token termine.
         * @param $q
         * @param config
         */
        function getReturn($q, config) {
            if (!factory.existAuthenticationToken()) {
                var deferred = $q.defer();
                factory.queue.push(function () {
                    config = factory.setAuthenticationHeader(config);
                    deferred.resolve(config);
                });
                $httpTransform.stop();
                return deferred.promise;
            }
            else {
                $httpTransform.stop();
                return config || $q.when(config);
            }
        };

        /**
         * @function - Após a obtenção do token de Autenticação executa todas os requests armazenados na fila
         * @param
         * @returns
         */
        function executeQueue() {
            if (factory.queue.length === 0) return;
            for (var i = 0; i < factory.queue.length; i++) factory.queue[i]();
            factory.clearQueue();
        };

        /**
         * @function - Limpeza da fila de requisições.
         * @param
         * @returns
         */
        function clearQueue() {
            factory.queue = [];
        };

        /**
         * @function - verifica se o request é de obtenção do token
         * @param {object} config
         * @returns
         */
        function isAuthenticationRequest(config) {
            if (config.url.match($apiSetting.url_get_authentication_excluded) != null) return true;
            return false;
        };

        /**
         * @function Request para atualização de token
         * @param
         * @returns
         */
        function getAuthenticationToken() {
            factory.controll.authentication_on_progress = true;
            var data = {
                 code: $apiSetting.code,
                 client_id: $apiSetting.client_id,
                 client_secret: $apiSetting.client_secret,
                 redirect_uri: $apiSetting.redirect_uri,
                 grant_type: $apiSetting.grant_type
            };
            factory.components.$http.post($apiSetting.url_get_authentication_token, data)
             .success(function (data, status, headers, config) {
                 factory.setAuthenticationCookie(factory.formatAuthenticationToken(data));
                 factory.controll.authentication_on_progress = false;
                 factory.executeQueue();
             })
             .error(function (data, status, headers, config) {
                 console.log("update authentication token - response with status : " + status);
             });
        };

        /**
         * @function - Seta um token para uso interno da factory
         * @param {object} token
         * @returns
         */
        function setAuthenticationToken(token) {
            factory.setAuthenticationCookie(factory.formatAuthenticationToken(token));
        };

        /**
         * @function Realiza a formatação do objeto token que irá ser gravado como cookie
         * @param {object} token
         * @returns {object} factory.token (objeto formatado)
         */
        function formatAuthenticationToken(token) {
            factory.token.access_token = token.access_token;
            factory.token.expires_in = token.expires_in - 60;
            factory.token.statusCode = token.statusCode;
            factory.token.token_type = token.token_type;
            factory.token.domain = window.location.host;
            factory.token.secure = true
            factory.token.expires = getAuthenticationCookieExpiration(factory.token.expires_in);
            factory.token.expirationUnit = 'seconds';
            return factory.token;
        };

        /**
         * @function - determina a expiração (tempo de válidade) do cookie
         * @param {int} seconds - data atual + quantidade de segundos
         * @returns
         */
        function getAuthenticationCookieExpiration(seconds) {
            var date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            return date;
        };

        /**
         * @function Escreve no cabeçalho o token de Autenticação
         * @param {object} config
         * @returns
         */
        function setAuthenticationHeader(config) {
            if (factory.getAuthenticationCookie() != undefined && !factory.isAuthenticationRequest(config))
                config.headers.Authorization = factory.token.token_type + ' ' + factory.token.access_token;
            return config;
        };

        /**
         * @function Verifica existe um cookie criado
         * @param
         * @returns
         */
        function existAuthenticationToken() {
            if (factory.getAuthenticationCookie() != undefined) {
                return true;
            }
            else {
                factory.token.access_token = undefined;
                factory.token.expires_in = undefined;
                factory.token.expires = undefined;
                factory.token.statusCode = undefined;
                factory.token.token_type = undefined;
                factory.token.domain = undefined;
                factory.token.secure = true;
                factory.token.expirationUnit = undefined;
            }
            return false;
        };

        /**
         * @function Seta o cookie de Autenticação
         * @param {object} token
         * @returns
         */
        function setAuthenticationCookie(token) {
            var cookie = {
                value: {
                    'token': token
                },
                params: {
                    expirationUnit: token.expirationUnit,
                    expires: token.expires_in,
                    path: '/'
                }
            };
            factory.components.ipCookie(factory.constants.AUTHENTICATIONTOKEN, cookie.value, cookie.params);
        };

        /**
         * @function Retorna o cookie de Autenticação
         * @param
         * @returns
         */
        function getAuthenticationCookie() {
            return factory.components.ipCookie(factory.constants.AUTHENTICATIONTOKEN);
        };

        /**
         * @function Deleta o cookie caso ele tenha expirado.
         * @param
         * @returns
         */
        function deleteExpiredCookie() {
            var cookie = getAuthenticationCookie();
            if (cookie != undefined) {
                var cookieDate = new Date(cookie.token.expires);
                var nowDate = new Date();
                if (nowDate > cookieDate) {
                    factory.components.ipCookie.remove(factory.constants.AUTHENTICATIONTOKEN);
                }
            }
        };
        return factory;
    };

    /**
     * @function Config
     * @param $httpProvider
     * @param $httpTransformProvider
     * @param $locationProvider
     * @param $provide
     */
    function $config($httpProvider, $httpTransformProvider, $locationProvider, $provide) {
        $locationProvider.html5Mode(false);
        $httpProvider.interceptors.push('$authenticationInterceptor');
        $httpProvider.defaults.transformRequest.push(function (data, headers) {
            $httpTransformProvider.load();
            return data;
        });
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    };

})();