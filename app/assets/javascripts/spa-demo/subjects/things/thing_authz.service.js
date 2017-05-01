/**
 * Created by prof.BOLA on 4/30/2017.
 */

(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .factory("spa-demo.subjects.ThingAuthz", ThingAuthzFactory);

    ThingAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                  "spa-demo.authz.BasePolicy"];
    
    function ThingAuthzFactory(Authz, BasePolicy) {

        function ThingAuthz() {
            BasePolicy.call(this, "Thing");
        }

        // start with base class prototype definitions
        ThingAuthz.prototype = Object.create(BasePolicy.prototype);
        ThingAuthz.constructor = ThingAuthz;

        // override and add additional method
        ThingAuthz.prototype.canQuery = function () {
            return Authz.isAuthenticated();
        };

        // add custom definition
        ThingAuthz.prototype.canAddImage = function (thing) {
            return Authz.isMember(thing)
        };

        ThingAuthz.prototype.canUpdateImage = function (thing) {
            return Authz.isOrganizer(thing);
        };

        ThingAuthz.prototype.canRemoveImage = function (thing) {
            return Authz.isOrganizer(thing) || Authz.isAdmin();
        };


        return new ThingAuthz();
    }
})();