/**
 * Created by prof.BOLA on 2/11/2017.
 */

(function () {

    "use strict";

    angular.module("spa-demo")
        .config(RouterFunction);

    RouterFunction.$inject = ["$stateProvider", "$urlRouterProvider", "spa-demo.config.APP_CONFIG"];

    function RouterFunction($stateProvider, $urlRouterProvider, APP_CONFIG) {
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: APP_CONFIG.main_page_html
            })
            .state("accountSignup", {
                url: "/signup",
                templateUrl: APP_CONFIG.signup_page_html
            });

        $urlRouterProvider.otherwise("/");
    }

})();
