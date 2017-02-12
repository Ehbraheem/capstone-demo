/**
 * Created by prof.BOLA on 2/12/2017.
 */

( function () {

    "use strict";

    angular
        .module("spa-demo.foos")
        .directive("sdFoos", FoosDirective);

    FoosDirective.$inject = ["spa-demo.APP_CONFIG"];

    function FoosDirective(APP_CONFIG) {
        var directive = {
            templateUrl: APP_CONFIG.foos_html,
            replace: true,
            bindToController: true,
            controller: "spa-demo.foos.FoosController",
            controllerAs: "foosVM",
            restrict: "E",
            scope: {},
            link: link
        };
        return directive;

        function link(scope, element, attr) {
            console.log('foosDirective ', scope);
        }
    }
})();