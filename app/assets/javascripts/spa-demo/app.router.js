/**
 * Created by prof.BOLA on 2/11/2017.
 */

(() => {

    "use strict";

    angular.module("spa-demo")
        .config(RouterFunction);

    RouterFunction.$inject = ["$stateProvider", "$urlRouterProvider", "spa-demo.APP_CONFIG"];

    function RouterFunction($stateProvider, $urlRouterProvider, APP_CONFIG) {
        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: APP_CONFIG.main_page_html
            });

        $urlRouterProvider.otherwise("/");
    }

})();
