/**
 * Created by prof.BOLA on 2/11/2017.
 */
(function () {

    "use strict";

    angular
        .module("spa-demo.foos")
        .controller("spa-demo.foos.FoosController", FoosController);

    FoosController.$inject = ["spa-demo.foos.Foo"];

    function FoosController (Foo) {

        var foosVM = this;
        foosVM.foos;
        foosVM.foo;

        activate();
        return;
        /////////////
        function activate() {
            newFoo();
            foosVM.foos = Foo.query();
            foosVM.edit = edit;
            foosVM.create = create;
            foosVM.update = update;
            foosVM.remove = remove;
        }

        function newFoo() {
            foosVM.foo = new Foo();
        }

        function handleError(response) {
            console.log(response)
        }

        function edit(object) {
            console.log("selected", object)
            foosVM.foo = object;
        }

        function create() {
            foosVM.foo.$save()
                .then(function (response) {
                    console.log(response);
                    foosVM.foos.push(foosVM.foo);
                    newFoo();
                })
                .catch(handleError);
        }

        function update() {
            foosVM.foo.$update()
                .then(function (response) {
                    console.log(response);
                })
                .catch(handleError);
        }

        function remove() {
            foosVM.foo.$delete()
                .then( function (response) {
                    console.log(response);
                    // remove the element from local array
                    removeElement(foosVM.foos, foosVM.foo);

                    // reload the element from the server
                    // foosVM.foos = Foo.query();

                    // replace edit area with prototype instance
                    newFoo();
                })
                .catch(handleError);
        }

        function removeElement(elements, element ) {
            console.log(elements, element)
            elements.filter(function (obj) {
                obj.id === element.id ? elements.splice(elements.indexOf(element),1) : null
            });
        };
    }

})();