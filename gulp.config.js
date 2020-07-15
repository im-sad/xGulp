const paths = {
  src: { // Source files
    html: `src/html/*.html`,
    style: `src/sass/*.scss`,
    js: `src/js/*.js`,
    img: [`src/img/**/*.{jpg,png}`, `!src/img/sprite/**/*`],
    svg: [`src/img/**/*.svg`, `!src/img/sprite/**/*`],
    spriteIcns: `src/img/sprite/*.svg`,
    fonts: `src/fonts/**/*.*`
  },
  build: { // Result files
    html: `build/`,
    style: `build/css/`,
    js: `build/js/`,
    img: `build/img/`,
    sprite: `build/img/sprite.svg`,
    fonts: `build/fonts/`
  },
  watch: { // Watch files
    html: `src/html/**/*.html`,
    style: `src/sass/**/*.scss`,
    js: `src/js/**/*.js`,
    img: [`src/img/**/*.{png,jpg}`, `!src/img/sprite/**/*`],
    svg: [`src/img/**/*.svg`, `!src/img/sprite/**/*`],
    spriteIcns: `src/img/sprite/*.{svg}`,
    fonts: `src/fonts/**/*.*`
  },
  clean: `build`
};

const autoprefixerCfg = {
  grid: true,
};

const sassCfg = {
  outputStyle: `expanded`,
  precision: 8,
  errLogToConsole: true,
};

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
};

const svgoCfg = {
  plugins: [
    {removeViewBox: false},
    {removeRasterImages: true},
    {removeUselessStrokeAndFill: false},
  ]
};

const htmlminCfg = {
  removeComments: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  removeScriptTypeAttributes: true,
};

const webpCfg = {
  preset: `photo`,
  quality: 60,
  method: 6 // 0 (fastest) and 6 (slowest)
};

const imageminCfg = {
  png: {
    optimizationLevel: 4 // optimization level between 0 and 7.
  },
  jpg: {
    quality: 60, // range 0 (worst) to 100 (perfect)
    progressive: true
  },
}


export {paths, autoprefixerCfg, sassCfg, serverCfg, svgoCfg, htmlminCfg, webpCfg, imageminCfg};
