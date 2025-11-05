const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const ts = require('gulp-typescript');
const del = require('del');
const p = require('./package.json');

const config = {
  src: "./src",
  pkgname: p.name,
  filename: p.name + ".js",
  dst: "./dist"
};

const tsProject = ts.createProject('tsconfig.json');

function getBrowserify(tinyify) {
  const b = browserify({
    entries: config.src + '/index.ts',
    standalone: config.pkgname
  }).plugin('tsify', {
    project: 'tsconfig.browser.json'
  });

  return tinyify === true ? b.plugin('tinyify').bundle() : b.bundle();
}

// Clean the output folder
gulp.task('clean', () => del([config.dst]));

// Bundle the project for the browser
gulp.task('browserify', () => {
  return getBrowserify()
    .pipe(source(config.filename))
    .pipe(buffer())
    .pipe(gulp.dest(config.dst + '/browser'));
});

// Bundle the project and tinify (flatPack, treeShake) it for the browser
gulp.task('tinyify', () => {
  return getBrowserify(true)
    .pipe(source(config.filename))
    .pipe(buffer())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.dst + '/browser'));
});

// Compile the project for Node and Typescript
gulp.task('tsc', () => {
  return gulp.src([config.src + '/**/*.ts'])
    .pipe(tsProject())
    .pipe(gulp.dest(config.dst + '/node'));
});

// Build step: build JS, tiny JS and TS declaration in parallel
gulp.task('build', gulp.series('clean', gulp.parallel('browserify', 'tinyify', 'tsc')));

// default task
gulp.task('default', gulp.series('browserify'));