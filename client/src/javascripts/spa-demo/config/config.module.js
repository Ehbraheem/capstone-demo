(function () {

    'use strict';

    angular
        .module('spa-demo.config', [
        ])
        .constant("spa-demo.config.APP_CONFIG", {
            server_url : "http://localhost:3000",
            main_page_html : "spa-demo/pages/main.html",
            foos_html : "spa-demo/foos/foos.html",

            signup_page_html : "spa-demo/pages/signup_page.html",

            authn_signup_html : "spa-demo/authn/signup/signup.html",
            authn_session_html : "spa-demo/authn/authn_session/authn_session.html",

            navbar_html : "spa-demo/layout/navbar/navbar.html",

        });
})();