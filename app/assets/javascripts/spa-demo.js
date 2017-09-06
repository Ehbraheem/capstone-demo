// SPA Demo Javascript Manifest File
//= require jquery2
//= require bootstrap
//= require angular
//= require angular-ui-router
//= require angular-resource
//= require angular-cookie
//= require ng-token-auth
//= require ng-file-upload-shim
//= require ng-file-upload
//= require ui-cropper

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

// Add LAYOUT module
//= require spa-demo/layout/layout.module
//= require spa-demo/layout/navbar/navbar.component

// Add AUTHN module
//= require spa-demo/authn/authn.module
//= require spa-demo/authn/authn.config
//= require spa-demo/authn/authn.service
//= require spa-demo/authn/signup/signup.component
//= require spa-demo/authn/authn_session/authn_session.component
//= require spa-demo/authn/checkme.service
//= require spa-demo/authn/whoami.service
//= require spa-demo/authn/authn_check/authn_check.directive

// Add Subjects module
//= require spa-demo/subjects/subjects.module

//= require spa-demo/subjects/images/images.service
//= require spa-demo/subjects/images/image_authz.service
//= require spa-demo/subjects/images/image_things.service
//= require spa-demo/subjects/images/image_linkable_thing.service
//= require spa-demo/subjects/images/images_authz.directive
//= require spa-demo/subjects/images/images.component

//= require spa-demo/subjects/things/things.service
//= require spa-demo/subjects/things/thing_images.service
//= require spa-demo/subjects/things/thing_authz.service
//= require spa-demo/subjects/things/things_authz.directive
//= require spa-demo/subjects/things/things.component

// Authz modules
//= require spa-demo/authz/authz.module
//= require spa-demo/authz/authz.service

// File Upload
//= require spa-demo/layout/image_loader/data_utils.service
//= require spa-demo/layout/image_loader/image_loader.component

//= require spa-demo/authz/base_policy.service