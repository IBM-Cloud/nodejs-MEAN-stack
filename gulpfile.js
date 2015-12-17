'use strict';

/********************************
Dependencies
********************************/
var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	nodeServer = require('./server');

/********************************
Development Server
********************************/

// View Docs Here: https://www.browsersync.io/docs/gulp/

gulp.task('serve', function () {

	browserSync.init({
		proxy : nodeServer.url
	});

    // Watch all files and reload on changes
    gulp.watch("public/**/*").on('change', browserSync.reload);
});

// Example: https://github.com/sogko/gulp-recipes/tree/master/browser-sync-nodemon-expressjs