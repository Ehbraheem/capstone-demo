/**
 * Created by prof.BOLA on 3/19/2017.
 */

(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .factrory("spa-demo.subjects.ThingImage", ThingImage);

    ThingImage.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];

    function ThingImage ($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/thing_images/:id",
            {
                thing_id : '@thing_id',
                id : '@id'},
            { update : { method : "PUT"}}
            );
    }
})();