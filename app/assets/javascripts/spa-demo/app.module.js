/**
 * Created by prof.BOLA on 2/11/2017.
 */
// TODO: Complete authn module first for External Client before Images
(function () {
    "use strict";

    angular
        .module("spa-demo", [
            "ui.router",
            "spa-demo.config",
            "spa-demo.foos",
            "spa-demo.authn",
            "spa-demo.layout",
            "spa-demo.subjects"
        ]);
})();