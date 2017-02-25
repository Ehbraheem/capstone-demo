/**
 * Created by prof.BOLA on 2/11/2017.
 */

(function () {
    "use strict";

    angular
        .module("spa-demo", [
            "ui.router",
            "spa-demo.config",
            "spa-demo.foos",
            "spa-demo.authn"
        ]);
})();