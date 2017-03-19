/**
 * Created by prof.BOLA on 3/19/2017.
 */

(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .factrory("spa-demo.subjects.ImageThing", ImageThing);

    ImageThing.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];

    function ImageThing ($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/images/:image_id/thing_images");
    }
})();