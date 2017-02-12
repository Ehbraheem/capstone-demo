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
            {
                update: { method: 'PUT',
                    transformRequest: buildNextedBody},
                save: { method: 'POST',
                    transformRequest: buildNextedBody}
            }
        )
    };

    // nests the default payload below a "foo" element
    // as required by Rails API by default
    function buildNextedBody(data) {
        return angular.toJson({foo: data})
    }
})();