"use strict";

var gulp = require('gulp');
// gulp flow control
var gulpif = require('gulp-if'),
	sync = require('gulp-sync')(gulp);
//build tools
var del = require('del'),
	debug = require('gulp-debug'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	replace = require('gulp-replace');
// dist minification
var useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	cssMin = require('gulp-clean-css'),
	htmlMin = require('gulp-htmlmin');
// runtime tools
var browserSync = require('browser-sync').create();

// where we place out source code
var srcPath = "client/src";
// where any processed code or vendor files gets placed for use in development
var buildPath = "client/build";
// location to place vendor files for use in development
var vendorBuildPath = buildPath + "/vendor";

// where the final web application is placed
var distPath = "public/client";
// location of our vendor packages
var bowerPath = "bower_components";

var cfg = {
	root_html : { src: srcPath + "/index.html", bld: buildPath },
	css : { src: srcPath + "/stylesheets/**/*.css", bld: buildPath + "/stylesheets" },
	js : { src: srcPath + "/javascripts/**/*.js" },
	html : { src: [srcPath + "/**/*.html", "!"+srcPath + "/*.html"]},


// vendor css src globs
bootstrap_sass: { src: bowerPath + "/bootstrap-sass/assets/stylesheets/" },

// vendor fonts src globs
bootstrap_fonts: { src: bowerPath + "/bootstrap-sass/assets/fonts/**/**" },

// vendor js src globs
jquery: { src:bowerPath + "/jquery2/jquery.js" },
bootstrap_js: { src: bowerPath + "/bootstrap-sass/assets/javascripts/bootstrap.js" },
angular: { src: bowerPath + "/angular/angular.js" },
angular_ui_router: { src: bowerPath + "/angular-ui-router/release/angular-ui-router.js" },
angular_resource: { src: bowerPath + "angular-resource/angular-resource.js" },


// vendor build locations
vendor_js: { bld: vendorBuildPath + "/javascrips" },
vendor_css: { bld: vendorBuildPath + "/stylesheets" },
vendor_fonts : { bld: vendorBuildPath + "/stylesheets/fonts" },


apiUrl : { dev: "http://localhost:3000",
	prd: "https://capstone-staged.herokuapp.com" },

};

// files within these paths will be served as root-level resources in this priority order
var devResourcePath = [
	cfg.vendor_js.bld,
	cfg.vendor_css.bld,
	buildPath+"/stylesheets",
	srcPath,
	srcPath+"/javascripts",
	srcPath+"/stylesheets",
   ];


// removes all files below the build area
gulp.task("clean:build", () => del(buildPath));

//removes all files below the dist area
gulp.task("clean:dist", () => del(distPath))

// removes all files below both the build and dist area
gulp.task("clean", ["clean:build", "clean:dist"]);

// place vendor css files in build area
gulp.task("vendor_css", () => {
	return gulp.src([
		])
	    .pipe(gulp.dest(cfg.vendor_css.bld)); 
});

gulp.task("vendor_js", () => {
	return gulp.src([
		cfg.jquery.src,
		cfg.bootstrap_js.src,
		cfg.angular.src,
		cfg.angular_ui_router.src,
		cfg.angular_resource.src])
		.pipe(gulp.dest(cfg.vendor_js.bld));
});
gulp.task("vendor_fonts", () => {
	return gulp.src([
		cfg.bootstrap_fonts.src])
		.pipe(gulp.dest(cfg.vendor_fonts.bld));
});

gulp.task("css", () => {
	return gulp.src(cfg.css.src).pipe(debug())
		   .pipe(sourcemaps.init())
		   .pipe(sass({ includePaths: [cfg.bootstrap_sass.src]}))
		   .pipe(sourcemaps.write("./maps"))
		   .pipe(gulp.dest(cfg.css.bld)).pipe(debug());
});


// prepare the development area
gulp.task("build", sync.sync(["clean:build", ["vendor_css", "vendor_js", "vendor_fonts", "css"]]));

// helper function to launch server and watch for changes
function browserSyncInit (baseDir, watchFiles) {
	browserSync.instance = browserSync.init( watchFiles, {
		server: { baseDir: baseDir},
		port: 8080,
		ui: { port: 8090}
	});
};

// run the browser against the development/build area and watch files beign edited
gulp.task("browserSync", ["build"], () => {
	browserSyncInit(devResourcePath, [
		cfg.root_html.src,
		cfg.css.bld + "/**/*.css",
		cfg.js.src,
		cfg.html.src,
	]);
});


// prepare the development environment, launch server and watch for changes
gulp.task("run", ["build", "browserSync"], () => {
	// expression to watch() within even if we need to pre-process source code
	gulp.watch(cfg.css.src, ["css"]);
});
// gulp.task("hello", () => console.log("hello"));

// gulp.task("world", ["hello"], () => console.log("world"));

// gulp.task("default", ["world"]);
