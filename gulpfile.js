'use strict';

/********************************
Dependencies
********************************/
var gulp = require('gulp'),
	browserSync = require('browser-sync').create();

/********************************
Development Server
********************************/

// View Docs Here: https://www.browsersync.io/docs/gulp/

gulp.task('serve', function () {

	// Serve files from the public root
	browserSync.init({
		server: {
			baseDir: "./public"
		}
	});

    // Watch all files and reload on changes
    gulp.watch("public/**/*").on('change', browserSync.reload);
});