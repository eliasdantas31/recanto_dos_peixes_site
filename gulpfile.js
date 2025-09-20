// gulpfile.js
import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import browserSyncLib from "browser-sync";
import * as del from "del";

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(dartSass);
const browserSync = browserSyncLib.create();

// Caminhos
const paths = {
  html: {
    src: ["src/index.html", "src/html__pages/**/*.html"],
    dest: "dist/"
  },
  styles: {
    src: "src/styles/main.scss",
    watch: "src/styles/**/*.scss",
    dest: "dist/css/"
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "dist/js/"
  },
  images: {
    src: "src/assets/imagens/**/*", // pega tudo dentro da pasta imagens
    dest: "dist/assets/imagens/"
  }
};

// Limpar dist
function clean() {
  return del.deleteAsync(["dist"]);
}

// HTML (cópia sem minificar)
function html() {
  return src(paths.html.src)
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// SCSS → CSS (sem minificação)
function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// JS (cópia sem minificação)
function scripts() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Imagens (cópia direta, sem compressão)
function images() {
  return src(paths.images.src, { encoding: false }) // encoding: false evita alteração binária
    .pipe(dest(paths.images.dest));
}

// Live server
function serve() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });

  watch(paths.html.src, html);
  watch(paths.styles.watch, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.images.src, images);
}

// Tasks
export { clean, html, styles, scripts, images };

export const build = series(
  clean,
  parallel(html, styles, scripts, images)
);

export const dev = series(
  clean,
  parallel(html, styles, scripts, images),
  serve
);