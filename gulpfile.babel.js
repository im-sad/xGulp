import gulp from 'gulp'
import del from 'del'
import notifier from 'node-notifier'
import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import sassGlob from 'gulp-sass-glob'
import autoprefixer from 'autoprefixer'
import mqpacker from 'css-mqpacker'
import csscomb from 'gulp-csscomb'
import sourcemaps from 'gulp-sourcemaps'
import cleanCSS from 'gulp-clean-css'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import changed from 'gulp-changed'
import imagemin from 'gulp-imagemin'
import imageminWebp from 'imagemin-webp'
import svgstore from 'gulp-svgstore'
import env from 'gulp-env'
import replace from 'gulp-replace'
import pug from 'gulp-pug'
import cached from 'gulp-cached'
import strip  from 'gulp-strip-comments'
import rename from 'gulp-rename'

import {
  paths, autoprefixerCfg, sassCfg, serverCfg, svgoCfg, webpCfg, imageminCfg, avifCfg, pugConfig
} from './gulp.config'
const server = browserSync.create()
const sass = gulpSass(dartSass)
const {watch, parallel, series, lastRun} = gulp

const clean = (done) => {
  del.sync(paths.clean)

  done()
}

const reloadServer = (done) => {
  server.reload()

  done()
}

const localServer = (done) => {
  server.init(serverCfg)

  done()
}

const updHash = () => {
  gulp.src(paths.build.pug)
  .pipe(replace('##hash##', Date.now()))
  .pipe(gulp.dest(paths.build.pug))
}

const copyFonts = (done) => {
  gulp.src(paths.src.fonts)
  .pipe(changed(paths.build.fonts))
  .pipe(gulp.dest(paths.build.fonts))

  done()
}

const copyFavicon = (done) => {
  gulp.src(paths.src.favicon)
  .pipe(changed(paths.build.favicon))
  .pipe(gulp.dest(paths.build.favicon))
  done()
}

// Html
const pugToHtml = (done) => {
  gulp.src(paths.src.pug)
  .pipe(plumber())
  .pipe(pug(pugConfig))
  .pipe(cached('pug'))
  .pipe(replace('##hash##', Date.now()))
  .pipe(gulp.dest(paths.build.pug))


  done()
}


// Styles
const styles = (done) => {
  gulp.src(paths.src.style)
  .pipe(plumber())
  .pipe(sassGlob())
  .pipe(sourcemaps.init())
  .pipe(
    sass(sassCfg).on('error', function(err) {
      console.log(err.messageFormatted)

      notifier.notify({
        title: `Sass ${err.name}`,
        message: `${err.relativePath} on line:${err.line} col:${err.column}`
      })
    })
  )
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.build.style))
  .pipe(server.stream())


  done()
}

const stylesMin = (done) => {
  gulp.src(paths.src.style)
  .pipe(plumber())
  .pipe(sassGlob())
  .pipe(
    sass(sassCfg).on('error', sass.logError)
  )
  .pipe(postcss([
    autoprefixer(autoprefixerCfg),
    mqpacker()
  ]))
  .pipe(csscomb())
  .pipe(gulp.dest(paths.build.style))

  .pipe(cleanCSS({level: 2})) // 1 or 2
  // .pipe(rename({suffix: `.min`}))
  .pipe(gulp.dest(paths.build.style))
  .pipe(server.stream())

  done()
}

// Scripts
const scripts = (done) => {
  env.set({
    NODE_ENV: 'development'
  })

  gulp.src(paths.src.js)
  .pipe(plumber())
  .pipe(webpackStream(require(`./webpack.config.js`), webpack, function(err, stats) {}))
  .pipe(gulp.dest(paths.build.js))

  done()
}

const scriptsMin = (done) => {
  env.set({
    NODE_ENV: 'production'
  })

  gulp.src(paths.src.js)
  .pipe(plumber())
  .pipe(webpackStream(require(`./webpack.config.js`), compiler, function(err, stats) {}))
  .pipe(strip())
  .pipe(gulp.dest(paths.build.js))

  done()
}


// Graphic
const images = (done) => {
  gulp.src(paths.src.img)
  .pipe(changed(paths.build.img))
  .pipe(gulp.dest(paths.build.img))

  done()
}

const imagesMin = (done) => {
  gulp.src(paths.src.img)
  .pipe(changed(paths.build.img))
  .pipe(imagemin([
    imagemin.optipng(imageminCfg.png),
    imagemin.mozjpeg(imageminCfg.jpg),
  ]))
  .pipe(gulp.dest(paths.build.img))

  done()
}

const webp = (done) => {
  gulp.src(paths.src.imgWebp, { since: lastRun(webp) })
  .pipe(imagemin([
    imageminWebp(webpCfg),
  ]))
  .pipe(rename({ extname: '.webp' }))
  .pipe(gulp.dest(paths.build.img))

  done()
}

const avifConvert = (done) => {
  gulp.src(paths.src.img)
  .pipe(gulpAvif(avifCfg))
  .pipe(gulp.dest(paths.build.img))

  done()
}

const svg = (done) => {
  gulp.src(paths.src.svg)
  .pipe(gulp.dest(paths.build.img))

  done()
}

const svgMin = (done) => {
  gulp.src(paths.src.svg)
  .pipe(imagemin([
    imagemin.svgo(svgoCfg),
  ]))
  .pipe(gulp.dest(paths.build.img))

  done()
}

const sprite = (done) => {
  gulp.src(paths.src.spriteIcns)
  .pipe(svgstore({inlineSvg: true}))
  .pipe(gulp.dest(paths.build.img))

  done()
}

const spriteMin = (done) => {
  gulp.src(paths.src.spriteIcns)
  .pipe(imagemin([
    imagemin.svgo(svgoCfg),
  ]))
  .pipe(svgstore({inlineSvg: true}))
  .pipe(gulp.dest(paths.build.img))

  done()
}

const changeVersionToMin = (done) => {
  gulp.src('build/**/*.html')
  .pipe(replace('style.css', 'style.min.css'))
  .pipe(replace('libs.js', 'style.min.css'))
  .pipe(replace('main.js', 'main.min.js'))
  .pipe(gulp.dest(paths.build.pug))

  done()
}



// Watch files
const watchFiles = (done) => {
  watch(paths.watch.pug, series(pugToHtml, reloadServer))
  watch(paths.watch.style, styles)
  watch(paths.watch.js, series(scripts, reloadServer))
  watch(paths.watch.fonts, series(copyFonts, reloadServer))
  watch(paths.watch.favicon, series(copyFavicon, reloadServer))
  watch(paths.watch.spriteIcns, series(sprite, reloadServer))
  watch(paths.watch.svg, series(svg, reloadServer))
  watch(paths.watch.img, series(parallel(webp, images), reloadServer))

  done()
}

// Compile
const buildAssets = series(
  parallel(stylesMin, scriptsMin)
)

const buildImages = series(
  parallel(imagesMin, webp, spriteMin)
)

const build = series(
  clean,
  parallel(pugToHtml, stylesMin, scriptsMin, spriteMin, copyFonts, copyFavicon, webp, svgMin, imagesMin)
)

export default series(
  clean,
  parallel(pugToHtml, styles, scripts, spriteMin, copyFonts, copyFavicon, webp, imagesMin, localServer),
  watchFiles
)

export {
  build, buildAssets, buildImages, styles, stylesMin, scripts, scriptsMin, sprite, spriteMin, pugToHtml, webp, avifConvert, svg, svgMin, images, imagesMin, copyFonts, copyFavicon, updHash
}
