// Gulp loader
const {
  src,
  dest,
  watch,
  series,
} = require('gulp');


// --------------------------------------------
// Dependencies
// --------------------------------------------

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Images plugins
let images = require('gulp-imagemin');

// Sass Task
function scssTask() {
  return src('src/scss/style.scss', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist/assets/css', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
  return src('src/js/script.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist/assets/js', { sourcemaps: '.' }));
}

// Images
function img() {
 return src('src/img/*')
    .pipe(images())
    .pipe(dest('dist/assets/img'));
  
};

//Vendors & Plugins Tasks



// Init Browser Watch
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: './dist'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  // Serve files from the root of this project
  watch('dist/*.html', browsersyncReload);
  watch(['src/**/*.scss', 'src/**/*.js','src/img/*'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series(
  scssTask,
  jsTask,
  img,
  browsersyncServe,
  watchTask
);