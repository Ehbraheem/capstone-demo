/**
 * Created by prof.BOLA on 2/11/2017.
 */
(function () {

    "use strict";

    angular
        .module("spa-demo.foos")
        .factory("spa-demo.foos.Foo", FooFactory);

    FooFactory.$inject = ["$resource", "spa-demo.APP_CONFIG"];

    function FooFactory ($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/foos/:id",
            { id: '@id'},
            { update: { method: 'PUT'}}
    )
    };
})();