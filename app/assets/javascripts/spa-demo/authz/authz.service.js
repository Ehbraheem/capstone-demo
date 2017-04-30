/**
 * Created by prof.BOLA on 4/29/2017.
 */

(function () {

    "use strict";

    angular
        .module("spa-demo.authz")
        .service("spa-demo.authz.Authz", Authz);

    Authz.$inject = ["$rootScope", "$q",
                     "spa-demo.authn.Authn",
                     "spa-demo.authn.whoAmI"];

    function Authz($rootScope, $q, Authn, whoAmI) {

        var service = this;

        service.user = null; //holds the result from the server
        service.userPromise = null; // promise during server requests
        service.admin = false;
        service.originator = [];

        service.getAuthorizedUser = getAuthorizedUser;
        service.getAuthorizedUserId = getAuthorizedUserId;
        service.isAuthenticated = isAuthenticated;
        service.isAdmin = isAdmin;
        service.isOriginator = isOriginator;
        service.isOrganizer = isOrganizer;
        service.isMember = isMember;
        service.hasRole = hasRole;

        activate();
        return;
        //////////////////////////
        function activate() {
            $rootScope.$watch(
                () => Authn.getCurrentUserId(),
                newUser
            )
        }


        function newUser() {
            var defered = $q.defer();
            service.userPromise = defered.promise;
            service.user = null;

            service.admin = false;
            service.originator = [];
            whoAmI.get().$promise.then(
                (response) => processUserRoles(response, defered),
                (response) => processUserRoles(response, defered)
        );
        };

        // process application-level roles returned from server
        function processUserRoles(response, defered) {
            console.log("processing roles", service.state, response);

            angular.forEach(response.user_roles, (value) => {
                if (value.role_name == "admin"){
                service.admin = true;
            } else if (value.role_name == "originator"){
                service.originator.push(value.resource);
            }
        });

            service.user = response;
            service.userPromise = null;
            defered.resolve(response);
            console.log("Processed roles", service.user);
        }

        function getAuthorizedUser() {
            var defered = $q.defer();

            var promise = service.userPromise;
            if (promise) {
                promise.then(
                    () => defered.resolve(service.user),
                    () => defered.reject(service.user)
            );
            } else {
                defered.resolve(service.user);
            }

            return defered.promise;
        }

        function getAuthorizedUserId() {
            return service.user && !service.userPromise ? service.user.id : null;
        }

        function isAuthenticated() {
            return getAuthorizedUserId() != null;
        }

        function isAdmin() {
            return service.user && service.admin && true;
        }

        // returns true if the current user has an organizer role for the instance
        // users with this role have the lead when modifying the instance
        function isOriginator(resource) {
            return service.user && service.originator.indexOf(resource)>= 0;
        }

        // returns true if the current user has an organizer role for the instance
        // users with this role have the lead when modifying the instance
        function isOrganizer(item) {
            return !item ? false : hasRole(item.user_roles, 'organizer')
        }

        // return true if the current user has a member role for the instance
        // users with this role are associated in a formal way with the instance
        // and may be able to make some modifications to the instance
        function isMember(item) {
            return !item ? false : hasRole(item.user_roles, "member") || isOrganizer(item);
        }

        // returns if the collection of roles contains the specified role
        function hasRole(user_roles, role) {
            if (role) {
                return !user_roles ? false : user_roles.indexOf(role) >= 0;
            } else {
                return !user_roles ? true : user_roles.length == 0;
            }
        }
    }


})();
