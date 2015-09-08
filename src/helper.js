/**
 * Helper Service for AngularJS
 * @version v0.0.1
 * @link http://www.ambersive.com
 * @licence MIT License, http://www.opensource.org/licenses/MIT
 */

(function(window, document, undefined) {'use strict';

    angular.module('ambersive.helper',[]);

    angular.module('ambersive.helper').factory('HelperSrv',['$http','$templateCache','$log',
        function($http,$templateCache,$log){

            var HelperSrv = {};

            HelperSrv.config = {
                'templates':{
                    'useCache':true,
                    'basePath':'',
                    'extension':'.html'
                }
            };

            /**
             * Function an unifing a response.
             */

            HelperSrv.response = function(response,callback){
                if(callback){
                    if(typeof(callback) === 'function'){
                        callback(response);
                    } else {
                        return response;
                    }
                } else {
                    return response;
                }
            };

            HelperSrv.template = {
                'get':function(obj,callback){

                    if(obj === undefined){
                        $log.error('The function: HelperSrv.template.get() needs a settings object');
                        return;
                    }

                    var useCache = HelperSrv.config.templates.useCache,
                        template = null,
                        templateUrl = null;

                    if(angular.isObject(obj) === true){
                        templateUrl = HelperSrv.template.url(obj);
                    } else {
                        templateUrl = obj;
                    }

                    if(useCache === true){
                        template = $templateCache.get(templateUrl);
                        return HelperSrv.response(template, callback);
                    } else {
                        if(callback === undefined){
                            $log.error('The function: HelperSrv.template.get() with no use of cache method needs to be called with a callback function. e.g. HelperSrv.template.get(obj,function(html){ });');
                        }
                        $http({method: 'GET', url: templateUrl, cache: true}).then(function(result) {
                            template = result.data;
                            return HelperSrv.response(template, callback);
                        });
                    }
                },
                'url':function(obj,callback){
                    var templateUrl = null,
                        init = true;
                    if(obj !== undefined){

                        templateUrl = HelperSrv.config.templates.basePath;

                        var addToUrl = function(url,init){
                            if(templateUrl === null || templateUrl === ''){
                                if(init === true){
                                    templateUrl = url;
                                } else {
                                    templateUrl = templateUrl+'/'+url;
                                }
                            } else {
                                templateUrl = templateUrl+'/'+url;
                            }
                        };

                        if(obj.application !== undefined){addToUrl(obj.application,init); init = false;}
                        if(obj.module !== undefined){addToUrl(obj.module,init); init = false;}
                        if(obj.folder !== undefined){addToUrl(obj.folder,init); init = false;}
                        if(obj.template !== undefined){addToUrl(obj.template+HelperSrv.config.templates.extension,init); init= false;}

                    }
                    return HelperSrv.response(templateUrl, callback);
                }
            };

            HelperSrv.generator = {
                'string':function(len,callback){
                    var lib = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    return HelperSrv.generator.generate(len,lib,callback);
                },
                'number':function(len,callback){
                    var lib = '0123456789';
                    return HelperSrv.generator.generate(len,lib,callback);
                },
                'alphanumeric':function(len,callback){
                    var lib = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    return HelperSrv.generator.generate(len,lib,callback);
                },
                'generate':function(length,lib,callback){
                    var text = '';
                    if (length === undefined) { length = 5; }
                    for (var i = 0; i < length; i++) {
                        text += lib.charAt(Math.floor(Math.random() * lib.length));
                        if (i + 1 === length) {
                            return HelperSrv.response(text, callback);
                        }
                    }
                }
            };

            HelperSrv.cookies = {
                'get': function (cname, callback) {
                    try {
                        var name = cname + '=',
                            response = '',
                            ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') c = c.substring(1);
                            if (c.indexOf(name) === 0) {
                                response = c.substring(name.length, c.length);
                            }
                        }
                        return HelperSrv.response(response, callback);
                    } catch(err){
                        $log.error(err);
                    }

                },
                'update': function (cname, cvalue, exdays, callback) {
                    var expires = '';
                    if (exdays === 0) {
                        expires = 'expires=0';
                    } else {
                        var d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        expires = 'expires=' + d.toUTCString();
                    }
                    document.cookie = cname + '=' + cvalue + '; ' + expires+';path=/';
                    return HelperSrv.response(HelperSrv.cookies.get(cname), callback);
                },
                'delete': function (cname) {
                    HelperSrv.cookies.update(cname, '', -100);
                }
            };

            return HelperSrv;

    }]);

})(window, document, undefined);