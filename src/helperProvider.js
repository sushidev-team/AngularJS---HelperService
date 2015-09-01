/**
 * Helper Service Provider for AngularJS
 * @version v0.0.1
 * @link http://www.ambersive.com
 * @licence MIT License, http://www.opensource.org/licenses/MIT
 */

(function(window, document, undefined) {'use strict';
    angular.module('ambersive.helper').provider('Helper',['HelperSrv',function(HelperSrv){
        return {
            template:HelperSrv.template,
            response:HelperSrv.response,
            $get:function(){
                return {
                    config:HelperSrv.config
                };
            }
        }
    }]);
})(window, document, undefined);