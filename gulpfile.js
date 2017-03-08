/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
******************************************************/
var gulp = require('gulp'),
  path = require('path'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  coffee = require('gulp-coffee'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  sassLint = require('gulp-sass-lint'),
  cssLint = require('gulp-csslint'),
  cleanCSS = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps'),
  stylus = require('gulp-stylus'),
  stylint = require('gulp-stylint'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  git = require('gulp-git');
  argv = require('minimist')(process.argv.slice(2));
  shell = require('gulp-shell');

/******************************************************
 * COPY TASKS - stream assets from source to public
******************************************************/
// JS copy
gulp.task('pl-copy:js', function(){
  return gulp.src('**/*.js', {cwd: path.resolve(paths().source.js)} )
    .pipe(sourcemaps.init())
    .pipe(concat(paths().publish.appName+".js"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.resolve(paths().public.js)))
    .pipe(browserSync.stream());
});

// CSS Copy
gulp.task('pl-copy:css', function(){
  return gulp.src(path.resolve(paths().source.css, '*.css'))
  .pipe(sourcemaps.init())
  .pipe(concat(paths().publish.appName+".css"))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.resolve(paths().public.css)))
  .pipe(browserSync.stream());
});

// Images copy
gulp.task('pl-copy:img', function(){
  return gulp.src('**/*.{ico,png,gif,jpg,jpeg,svg,tif,bmp,ico}',{cwd: path.resolve(paths().source.images)} )
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(path.resolve(paths().public.images)));
});

// Favicon copy
gulp.task('pl-copy:favicon', function(){
  return gulp.src('*.{ico,png,gif,jpg,jpeg,svg}', {cwd: path.resolve(paths().source.root)} )
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(path.resolve(paths().public.root)));
});

// Fonts copy
gulp.task('pl-copy:font', function(){
  return gulp.src('**/*.{svg,eot,ttf,woff,otf,woff2}', {cwd: path.resolve(paths().source.fonts)})
    .pipe(gulp.dest(path.resolve(paths().public.fonts)));
});

// AJAX Copy
gulp.task('pl-copy:ajax', function(){
  return gulp.src(path.resolve(paths().source.ajax, '**/*'))
    .pipe(gulp.dest(path.resolve(paths().public.ajax)));
});

// Components Copy
gulp.task('pl-copy:components', function(){
  return gulp.src('**/*.*',{cwd: path.resolve(paths().source.components)} )
    .pipe(gulp.dest(path.resolve(paths().public.components)));
});

// Vendors copy
gulp.task('pl-copy:vendors', function(){
  return gulp.src('**/*.*',{cwd: path.resolve(paths().source.vendors)} )
    .pipe(gulp.dest(path.resolve(paths().public.vendors)));
});

// Styleguide Copy everything but css
gulp.task('pl-copy:styleguide', function(){
  return gulp.src(path.resolve(paths().source.styleguide, '**/!(*.css)'))
    .pipe(gulp.dest(path.resolve(paths().public.root)))
    .pipe(browserSync.stream());
});

// Styleguide Copy and flatten css
gulp.task('pl-copy:styleguide-css', function(){
  return gulp.src(path.resolve(paths().source.styleguide, '**/*.css'))
    .pipe(gulp.dest(function(file){
      //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
      file.path = path.join(file.base, path.basename(file.path));
      return path.resolve(path.join(paths().public.styleguide, 'css'));
    }))
    .pipe(browserSync.stream());
});

/******************************************************
 * COMPILE TASKS - Compile assets
******************************************************/
// Compile CoffeeScript
gulp.task('pl-compile:coffee', function(){
  return gulp.src('*.coffee',{cwd: path.resolve(paths().source.js)} )
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(concat(paths().publish.appName+".js"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.resolve(paths().public.js)))
    .pipe(browserSync.stream({match: '**/*.js'}));
})

// Compile Sass
gulp.task('pl-compile:sass', function(){
  return gulp.src('*.scss',{cwd: path.resolve(paths().source.css)} )
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 8
    }))
    .pipe(concat(paths().publish.appName+".css"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream({match: '**/*.css'}));
})

gulp.task('pl-compile:stylus', function(){
  return gulp.src('*.styl',{cwd: path.resolve(paths().source.css)})
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(concat(paths().publish.appName+".css"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream({match: '**/*.css'}));
})

/******************************************************
 * VALIDATE TASKS - Validate preprocessors
******************************************************/
// Validate Sass
gulp.task('pl-validate:sass', function() {
  return gulp.src('**/*.scss',{cwd: path.resolve(paths().source.css)} )
  .pipe(sassLint())
  .pipe(sassLint.format());
})

// Validate CSS
gulp.task('pl-validate:css', function() {
  return gulp.src('**/*.css',{cwd: path.resolve(paths().source.css)} )
  .pipe(cssLint())
  .pipe(cssLint.format());
})

// Validate Stylus
gulp.task('pl-validate:stylus', function() {
  return gulp.src('**/*.styl',{cwd: path.resolve(paths().source.css)} )
  .pipe(stylint())
  .pipe(stylint.reporter());
})

/******************************************************
 * CLEAN TASKS - Clean assets
******************************************************/
// Clean
gulp.task('pl-clean:publish', function(){
  return del([path.resolve(paths().publish.root) + '**/*']);
});

gulp.task('pl-clean:public', function(){
  return del([path.resolve(paths().public.root) + '**/*']);
});

/******************************************************
 * PUBLISH TASKS - stream assets from public to dist
******************************************************/
// JS copy
gulp.task('pl-dist:js', function(){
  gulp.src('**/*.js', {cwd: path.resolve(paths().public.js)} )
    .pipe(gulp.dest(path.resolve(paths().publish.js)))
    .pipe(concat(paths().publish.appName+".js"))
    .pipe(gulp.dest(path.resolve(paths().publish.js)));

  return gulp.src('**/*.js', {cwd: path.resolve(paths().public.js)} )
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.resolve(paths().publish.js)))
    .pipe(concat(paths().publish.appName + '.min.js'))
    .pipe(gulp.dest(path.resolve(paths().publish.js)));
});

// Images copy
gulp.task('pl-dist:img', function(){
  return gulp.src('**/*.{ico,png,gif,jpg,jpeg,svg,tif,bmp,ico}', {cwd: path.resolve(paths().public.images)} )
    .pipe(gulp.dest(path.resolve(paths().publish.images)));
});

// Favicon copy
gulp.task('pl-dist:favicon', function(){
  return gulp.src('*.{ico,png,gif,jpg,jpeg,svg}', {cwd: path.resolve(paths().public.root)} )
    .pipe(gulp.dest(path.resolve(paths().publish.root)));
});

// Fonts copy
gulp.task('pl-dist:font', function(){
  return gulp.src('**/*.{svg,eot,ttf,woff,otf,woff2}', {cwd: path.resolve(paths().public.fonts)})
    .pipe(gulp.dest(path.resolve(paths().publish.fonts)));
});

// CSS Copy
gulp.task('pl-dist:css', function(){
  gulp.src(path.resolve(paths().public.css, '*.css'))
    .pipe(gulp.dest(path.resolve(paths().publish.css)))
    .pipe(concat(paths().publish.appName + '.css'))
    .pipe(gulp.dest(path.resolve(paths().publish.css)));

  return gulp.src(path.resolve(paths().public.css, '*.css'))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.resolve(paths().publish.css)))
    .pipe(concat(paths().publish.appName + '.min.css'))
    .pipe(gulp.dest(path.resolve(paths().publish.css)));
});

// Components publish    
gulp.task('pl-dist:components', function(){   
    return gulp.src('**/*.*', {cwd: path.resolve(paths().public.components)})   
        .pipe(gulp.dest(path.resolve(paths().publish.components)));   
});

/******************************************************
 * PATTERN LAB CONFIGURATION - API with core library
******************************************************/
//read all paths from our namespaced config file
var config = require('./patternlab-config.json'),
  patternlab = require('patternlab-node')(config);

function paths() {
  return config.paths;
}

function getConfiguredCleanOption() {
  return config.cleanPublic;
}

function build(done) {
  patternlab.build(done, getConfiguredCleanOption());
}

gulp.task('pl-stylesheets', gulp.series(
  'pl-copy:css',
  'pl-compile:sass',
  'pl-compile:stylus',
  function(done){
    done();
  })
);

gulp.task('pl-scripts', gulp.series(
  'pl-copy:js',
  'pl-compile:coffee',
  function(done){
    done();
  })
);

gulp.task('pl-assets', gulp.series(
  gulp.parallel(
    'pl-stylesheets',
    'pl-scripts',
    'pl-copy:img',
    'pl-copy:favicon',
    'pl-copy:font',
    'pl-copy:ajax',
    'pl-copy:components',
    'pl-copy:vendors',
    'pl-copy:styleguide',
    'pl-copy:styleguide-css'
  ),
  function(done){
    done();
  })
);

gulp.task('pl-dist', gulp.series(
  gulp.parallel(
    'pl-dist:js',
    'pl-dist:img',
    'pl-dist:favicon',
    'pl-dist:font',
    'pl-dist:css',
    'pl-dist:components'    
  ),
  function(done){
    done();
  })
);

gulp.task('pl-clean', gulp.series(
  gulp.parallel(
    'pl-clean:public',
    'pl-clean:publish'
  ),
  function(done){
    done();
  })
);

gulp.task('patternlab:version', function (done) {
  patternlab.version();
  done();
});

gulp.task('patternlab:help', function (done) {
  patternlab.help();
  done();
});

gulp.task('patternlab:patternsonly', function (done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
});

gulp.task('patternlab:liststarterkits', function (done) {
  patternlab.liststarterkits();
  done();
});

gulp.task('patternlab:loadstarterkit', function (done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
});

gulp.task('patternlab:build', gulp.series('pl-assets', build, function(done){
  done();
}));

/******************************************************
 * TESTS TASKS
******************************************************/
//unit test
gulp.task('pl-nodeunit', function(){
  return gulp.src('./test/**/*_tests.js')
    .pipe(nodeunit());
})

/******************************************************
 * SERVER AND WATCH TASKS
******************************************************/
// watch task utility functions
function getSupportedTemplateExtensions() {
  var engines = require('./node_modules/patternlab-node/core/lib/pattern_engines');
  return engines.getSupportedFileExtensions();
}
function getTemplateWatches() {
  return getSupportedTemplateExtensions().map(function (dotExtension) {
    return path.resolve(paths().source.patterns, '**/*' + dotExtension);
  });
}

function reload() {
  browserSync.reload();
}

function reloadCSS() {
  browserSync.reload('*.css');
}

function watch() {
  gulp.watch(path.resolve(paths().source.css, '**/*.styl'), { awaitWriteFinish: false }).on('change', gulp.series('pl-compile:stylus'));
  gulp.watch(path.resolve(paths().source.css, '**/*.css'), { awaitWriteFinish: false }).on('change', gulp.series('pl-copy:css'));
  gulp.watch(path.resolve(paths().source.css, '**/*.scss'), { awaitWriteFinish: false }).on('change', gulp.series('pl-compile:sass'));
  gulp.watch(path.resolve(paths().source.js, '**/*.js'), { awaitWriteFinish: false }).on('change', gulp.series('pl-copy:js'));
  gulp.watch(path.resolve(paths().source.js, '**/*.coffee'), { awaitWriteFinish: false }).on('change', gulp.series('pl-compile:coffee'));
  gulp.watch(path.resolve(paths().source.ajax, '**/*'), { awaitWriteFinish: false }).on('change', gulp.series('pl-copy:ajax'));
  gulp.watch(path.resolve(paths().source.styleguide, '**/*.*'), { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:styleguide', 'pl-copy:styleguide-css', reloadCSS));

  var patternWatches = [
    path.resolve(paths().source.patterns, '**/*.{json,mustache,md}'),
    path.resolve(paths().source.data, '*.json'),
    path.resolve(paths().source.fonts + '/*'),
    path.resolve(paths().source.images + '/*'),
    path.resolve(paths().source.meta, '*'),
    path.resolve(paths().source.annotations + '/*')
  ].concat(getTemplateWatches());

  gulp.watch(patternWatches, { awaitWriteFinish: false }).on('change', gulp.series(build, reload));
}

gulp.task('patternlab:connect', gulp.series(function(done) {
  browserSync.init({
    server: {
      baseDir: path.resolve(paths().public.root)
    },
    snippetOptions: {
      // Ignore all HTML files within the templates folder
      blacklist: ['/index.html', '/', '/?*']
    },
    notify: {
      styles: [
        'display: none',
        'padding: 15px',
        'font-family: sans-serif',
        'position: fixed',
        'font-size: 1em',
        'z-index: 9999',
        'bottom: 0px',
        'right: 0px',
        'border-top-left-radius: 5px',
        'background-color: #1B2032',
        'opacity: 0.4',
        'margin: 0',
        'color: white',
        'text-align: center'
      ]
    }
  }, function(){
    console.log('PATTERN LAB NODE WATCHING FOR CHANGES');
    done();
  });
}));

/******************************************************
 * COMPOUND TASKS
******************************************************/
gulp.task('default', gulp.series('patternlab:build'));
gulp.task('patternlab:watch', gulp.series('patternlab:build', watch));
gulp.task('patternlab:serve', gulp.series('patternlab:build', 'patternlab:connect', watch));
gulp.task('patternlab:dist', gulp.series('pl-dist'));
gulp.task('patternlab:clean', gulp.series('pl-clean'));
gulp.task('serve', gulp.series('patternlab:serve'));
gulp.task('clean', gulp.series('patternlab:clean'));
gulp.task('build', gulp.series('patternlab:build'));
gulp.task('publish', gulp.series('patternlab:clean', 'patternlab:build', 'patternlab:dist'));

/******************************************************
 * UTILITY TASKS
******************************************************/

gulp.task('git:push', shell.task([
  'git add -A .',
  'git commit -am "'+argv.m+'"',
  'git push'
]))

gulp.task('release', shell.task([
  'git tag -a '+argv.t+' -m "new version '+argv.t+'"',
  'git push origin '+argv.t
]))

gulp.task('git:pull', function (done) {
  git.pull();
  done();
});

gulp.task('push', gulp.series(
  "git:pull",
  "publish",
  "git:push"
));
