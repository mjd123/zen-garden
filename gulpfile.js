// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');
var browserSync = require('browser-sync').create();

    // File paths
const files = { 
    scssPath: 'scss/**/*.scss',
}

// Cachebust
function cacheBustTask(){
    var cbString = new Date().getTime();
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}


// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('./build')
    ); // put final CSS in dist folder
}


function reload(done) {
    browserSync.reload();
    done();
  }
  
  function serve(done) {
    browserSync.init({
      server: {
        baseDir: './'
      }
    });
    done();
  }


// sass/css browser tracking
function watchTask(){
    watch(files.scssPath,
        series(
            scssTask,
            cacheBustTask,
            reload
        )
    );    
}



// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    scssTask, 
    cacheBustTask,
    serve,
    watchTask
);