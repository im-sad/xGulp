const paths = {
  // Source files
  src: {
    pug: `src/pug/pages/*.pug`,
    style: `src/sass/*.scss`,
    js: `src/js/*.js`,
    img: [`src/img/**/*.{jpg,png,svg}`, `!src/img/sprite/**/*`],
    svg: [`src/img/**/*.svg`, `!src/img/sprite/**/*`],
    spriteIcns: `src/img/sprite/*.svg`,
    fonts: `src/fonts/**/*.*`,
    favicon: `src/favicon/*.*`
  },
  // Result files
  build: {
    pug: `build/`,
    style: `build/css/`,
    js: `build/js/`,
    img: `build/img/`,
    sprite: `build/img/sprite.svg`,
    fonts: `build/fonts/`,
    favicon: `build/`
  },
  // Watch files
  watch: {
    pug: `src/pug/**/*.{pug,js}`,
    style: `src/sass/**/*.scss`,
    js: `src/js/**/*.js`,
    img: [`src/img/**/*.{png,jpg,svg}`, `!src/img/sprite/**/*`],
    svg: [`src/img/**/*.svg`, `!src/img/sprite/**/*`],
    spriteIcns: `src/img/sprite/*.{svg}`,
    fonts: `src/fonts/**/*.*`,
    favicon: `src/favicon/*.*`
  },
  clean: `build`
}

const autoprefixerCfg = {
  grid: true,
}

const sassCfg = {
  outputStyle: `expanded`,
  precision: 8,
  errLogToConsole: true,
}

const serverCfg = {
  server: {
    baseDir: `./build`,
    index: `index.html`
  },
  tunnel: false,
  host: `localhost`,
  port: 9000,
  notify: false,
  logPrefix: `xGulp`
}

const svgoCfg = {
  plugins: [
    {removeViewBox: false},
    {removeRasterImages: true},
    {removeUselessStrokeAndFill: false},
  ]
}

const htmlminCfg = {
  removeComments: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  removeScriptTypeAttributes: true,
}

const pugConfig = {
  pretty: true
}

const webpCfg = {
  preset: `photo`,
  quality: 70,
  method: 6 // 0 (fastest) and 6 (slowest)
}

const avifCfg = {
  quality: 80,
  lossless: false
}

const imageminCfg = {
  png: {
    optimizationLevel: 4 // optimization level between 0 and 7.
  },
  jpg: {
    quality: 80, // range 0 (worst) to 100 (perfect)
    progressive: true
  },
}


export {
  paths, autoprefixerCfg, sassCfg, serverCfg, svgoCfg, htmlminCfg, pugConfig, webpCfg, avifCfg, imageminCfg
}
