import gulp from 'gulp'
import del from 'del'
import notifier from 'node-notifier'
import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import gulpSass from "gulp-sass"
import dartSass from "sass"
import sassGlob from 'gulp-sass-glob'
import autoprefixer from 'autoprefixer'
import mqpacker from 'css-mqpacker'
import csscomb from 'gulp-csscomb'
import sourcemaps from 'gulp-sourcemaps'
import cleanCSS from 'gulp-clean-css'
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
  .pipe(webpackStream( require(`./webpack.config.js`) ))
  .pipe(gulp.dest(paths.build.js))

  done()
}

const scriptsMin = (done) => {
  env.set({
    NODE_ENV: 'production'
  })

  gulp.src(paths.src.js)
  .pipe(plumber())
  .pipe(webpackStream( require(`./webpack.config.js`) ))
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

const webpConvert = (done) => {
  gulp.src(paths.src.imgWebp)
  .pipe(imagemin([
    imageminWebp(),
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
  gulp.watch(paths.watch.pug, gulp.series(pugToHtml, reloadServer))
  gulp.watch(paths.watch.style, styles)
  gulp.watch(paths.watch.js, gulp.series(scripts, reloadServer))
  gulp.watch(paths.watch.fonts, gulp.series(copyFonts, reloadServer))
  gulp.watch(paths.watch.favicon, gulp.series(copyFavicon, reloadServer))
  gulp.watch(paths.watch.spriteIcns, gulp.series(sprite, reloadServer))
  gulp.watch(paths.watch.svg, gulp.series(svg, reloadServer))
  gulp.watch(paths.watch.img, gulp.series(gulp.parallel(webpConvert, images), reloadServer))

  done()
}

// Compile
const buildAssets = gulp.series(
  gulp.parallel(stylesMin, scriptsMin)
)

const build = gulp.series(
  clean,
  gulp.parallel(pugToHtml, stylesMin, scriptsMin, spriteMin, copyFonts, copyFavicon, webpConvert, svgMin, imagesMin)
)

export default gulp.series(
  clean,
  gulp.parallel(pugToHtml, styles, scripts, spriteMin, copyFonts, copyFavicon, webpConvert, imagesMin, localServer),
  watchFiles
)

export {
  build, buildAssets, styles, stylesMin, scripts, scriptsMin, sprite, spriteMin, pugToHtml, webpConvert, avifConvert, svg, svgMin, images, imagesMin, copyFonts, copyFavicon, updHash
}
