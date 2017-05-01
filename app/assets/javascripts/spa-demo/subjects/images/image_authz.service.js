/**
 * Created by prof.BOLA on 4/30/2017.
 */

(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .factory("spa-demo.subjects.ImageAuthz", ImageAuthzFactory);

    ImageAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                 "spa-demo.authz.BasePolicy"];

    function ImageAuthzFactory(Authz, BasePolicy) {

        function ImageAuthz() {
            BasePolicy.call(this, "Image");
        }

        // start with base class prototype definitions
        ImageAuthz.prototype = Object.create(BasePolicy.prototype);
        ImageAuthz.constructor = ImageAuthz;

        // override and add additional methods
        ImageAuthz.prototype.canCreate = function () {
            return Authz.isAuthenticated();
        }

        return new ImageAuthz();
    }
})();