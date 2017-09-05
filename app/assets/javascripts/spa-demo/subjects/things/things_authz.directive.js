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

    ThingsAuthzController.$inject = ["$scope",
                                     "spa-demo.subjects.ThingAuthz"];

    function ThingsAuthzController ($scope, ThingAuthz) {
        var vm                   = this;
        vm.authz                 = {};
        vm.authz.canUpdateItem   = canUpdateItem;
        vm.newItem               = newItem;


        activate();

        return;
        ////////////////////////////////
        function activate() {
            // $scope.$watch(Authn.getCurrentUser, newUser);
            vm.newItem(null);
        }

        function newItem(item) {
            ThingAuthz.getAuthorizedUser().then(
                (user) => authzUserItem(item, user),
                (user) => authzUserItem(item, user))
        }

        function authzUserItem(item, user) {
            console.log("new Item/Authz", item, user);

            vm.authz.authenticated = ThingAuthz.isAuthenticated();
            vm.authz.canQuery      = ThingAuthz.canQuery();
            vm.authz.canCreate     = ThingAuthz.canCreate();

            if (item && item.$promise) {
                vm.authz.canUpdate      = false;
                vm.authz.canDelete      = false;
                vm.authz.canGetDetails  = false;
                vm.authz.canRemoveImage = false;
                vm.authz.canUpdateImage = false;

                item.$promise.then( item => checkAccess(item) );
            } else {
                checkAccess(item);
            }
        }

        function checkAccess(item) {
            vm.authz.canUpdate = ThingAuthz.canUpdate(item);
            vm.authz.canGetDetails = ThingAuthz.canGetDetails(item);
            vm.authz.canDelete = ThingAuthz.canDelete(item);
            vm.authz.canUpdateImage = ThingAuthz.canUpdateImage(item);
            vm.authz.canRemoveImage = ThingAuthz.canRemoveImage(item);

            console.log("checkAccess", item, vm.authz);
        }

        function canUpdateItem(item) {
            return ThingAuthz.canUpdate(item);
        }
    }
})();