/**
 * Created by prof.BOLA on 3/19/2017.
 */

(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdThingsAuthz", ThingsAuthz);

    ThingsAuthz.$inject = [];

    function ThingsAuthz () {
        var ddo = {
            bindToController : true,
            controller : ThingsAuthzController,
            controllerAs : "vm",
            restrict : 'A',
            scope : {
                authz: '='
            },
            link : link
        }
        return ddo;

        function link(scope, element, attr) {
            console.log("From ThingsAuthz scope=",scope," element=", element, " attr=", attr);
        }
    }

    ThingsAuthzController.$inject = ["$scope", "spa-demo.authn.Authn" ];

    function ThingsAuthzController ($scope, Authn) {
        var vm                   = this;
        vm.authz                 = {};
        vm.authz.authenticated   = false;
        vm.authz.canDelete       = false;
        vm.authz.canUpdate       = false;
        vm.authz.canGetDetails   = false;
        vm.authz.canUpdateItem   = canUpdateItem;
        vm.authz.canQuery        = false;
        vm.authz.canCreate       = false;

        ThingsAuthzController.prototype.resetAccess = function () {
            this.authz.canQuery      = false;
            this.authz.canCreate     = false;
            this.authz.canUpdate     = false;
            this.authz.canDelete     = false;
            this.authz.canGetDetails = false;
        }

        activate();

        return;
        ////////////////////////////////
        function activate() {
            vm.resetAccess();
            $scope.$watch(Authn.getCurrentUser, newUser);
        }

        function newUser(user, prevUser) {
            console.log("newUser=", user, ", prev=",prevUser);
            vm.authz.canQuery = true;
            vm.authz.authenticated = Authn.isAuthenticated();
            if (vm.authz.authenticated) {
                vm.authz.canCreate     = true;
                vm.authz.canUpdate     = true;
                vm.authz.canDelete     = true;
                vm.authz.canGetDetails = true;
            } else {
                vm.resetAccess();
            }
        }

        function canUpdateItem(item) {
            return Authn.isAuthenticated();
        }
    }
})();