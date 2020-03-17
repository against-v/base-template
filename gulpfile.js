//
const { src, dest, series } = require("gulp");
const del = require("del");
const rename = require("gulp-rename");
const connect = require("gulp-connect");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const postcss = require("gulp-postcss")
const autoprefixer = require("autoprefixer");
const csso = require('gulp-csso');

//для передачи параметра в командную строку
const argv = require("yargs").argv;

const gulpif = require("gulp-if")

//удаление
function clean() {
  return del("build");
}
//копирование
function copy () {
  return src([
    "source/index.html",
  ], {
    base: "source"
  })
    .pipe(dest("build"));
}
//стили с минификации
function style () {
  return src([
    "source/styles/main.scss"
  ])
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulpif(argv.production, csso()))
    .pipe(gulpif(argv.production, rename("style.min.css"), rename("style.css")))
    .pipe(dest("build/css"));
}
//стили без минификации
function styleDev () {
  return src([
    "source/styles/main.scss"
  ])
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename("style.css"))
    .pipe(dest("build/css"));
}

//скрипты
function scripts () {
  return src([
    "source/scripts/**/*.js",
  ])
    .pipe(dest("build/js"));
}

//сервер
function server () {
  connect.server({
    root: "build",
    livereload: true
  });
}

exports.build = series(
  clean,
  copy,
  style,
  scripts,
  server
);

