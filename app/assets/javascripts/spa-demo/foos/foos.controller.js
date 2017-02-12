/**
 * Created by prof.BOLA on 2/11/2017.
 */
(() => {

    "use strict";

    angular
        .module("spa-demo.foos")
        .controller("spa-demo.foos.FoosController", FoosController);

    FoosController.$inject = ["spa-demo.foos.Foo"];

    function FoosController (Foo) {

        var foosCtrl = this;
        foosCtrl.foos;
        foosCtrl.foo;

        activate();
        return;
        /////////////
        function activate() {
            newFoo();
        } 
        
        function newFoo() {
           foosCtrl.foo = new Foo();
        }
        
        function handleError(response) {
            console.log(response)
        }
        
        function edit(object, index) {
            
        }
        
        function create() {
            
        }

        function update() {

        }

        function remove() {

        }

        function removeElement(elements, element ) {

        }
    }

})();