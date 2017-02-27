// SPA Demo Javascript Manifest File
//= require jquery2
//= require bootstrap
//= require angular
//= require angular-ui-router
//= require angular-resource
//= require angular-cookie
//= require ng-token-auth

// Add our files to the manifest for AP load
//= require spa-demo/app.module
//= require spa-demo/app.router

// App configuration module
//= require spa-demo/config/config.module

// Add FOOs module
//= require spa-demo/foos/foos.module
//= require spa-demo/foos/foos.service
//= require spa-demo/foos/foos.controller
//= require spa-demo/foos/foos.directive

// Add AUTHN module
//= require spa-demo/authn/authn.module
//= require spa-demo/authn/authn.config
//= require spa-demo/authn/authn.service
//= require spa-demo/authn/signup/signup.component