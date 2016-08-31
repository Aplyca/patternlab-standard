/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
******************************************************/
var gulp = require('gulp'),
  path = require('path'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  cssmin = require('gulp-cssnano'), 
  sassLint = require('gulp-sass-lint'),
  cssLint = require('gulp-csslint'),  
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),      
  browserSync = require('browser-sync').create(),
  argv = require('minimist')(process.argv.slice(2));

/******************************************************
 * COPY TASKS - stream assets from source to public
******************************************************/
// JS copy
gulp.task('pl-copy:js', function(){
  return gulp.src('**/*.js', {cwd: path.resolve(paths().source.js)} )
    .pipe(gulp.dest(path.resolve(paths().public.js)));
});

// Images copy
gulp.task('pl-copy:img', function(){
  return gulp.src('**/*.*',{cwd: path.resolve(paths().source.images)} )
    .pipe(gulp.dest(path.resolve(paths().public.images)));
});

// Favicon copy
gulp.task('pl-copy:favicon', function(){
  return gulp.src('favicon.ico', {cwd: path.resolve(paths().source.root)} )
    .pipe(gulp.dest(path.resolve(paths().public.root)));
});

// Fonts copy
gulp.task('pl-copy:font', function(){
  return gulp.src('*', {cwd: path.resolve(paths().source.fonts)})
    .pipe(gulp.dest(path.resolve(paths().public.fonts)));
});

// AJAX Copy
gulp.task('pl-copy:ajax', function(){
  return gulp.src(path.resolve(paths().source.ajax, '*.json'))
    .pipe(gulp.dest(path.resolve(paths().public.ajax)));
});

// CSS Copy
gulp.task('pl-copy:css', function(){
  return gulp.src(path.resolve(paths().source.css, '*.css'))
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream());
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

gulp.task('pl-compile:sass', function(){
  return gulp.src('*.scss',{cwd: path.resolve(paths().source.css)} )
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 8
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream({match: '**/*.css'}));   
})

gulp.task('pl-compile:validate-sass', function() {
  return gulp.src('**/*.scss',{cwd: path.resolve(paths().source.css)} )
  .pipe(sassLint())
  .pipe(sassLint.format());
})

gulp.task('pl-compile:validate-css', function() {
  return gulp.src('**/*.css',{cwd: path.resolve(paths().source.css)} )
  .pipe(sassLint())
  .pipe(sassLint.format());
})

/******************************************************
 * PUBLISH TASKS - stream assets from public to dist
******************************************************/
// PUBLISH clean
gulp.task('pl-publish:clean', function(){
  return del([path.resolve(paths().publish.root).concat('**/*')]);
});

// JS copy
gulp.task('pl-publish:js', function(){
  return gulp.src('**/*.js', {cwd: path.resolve(paths().public.js)} )
    .pipe(gulp.dest(path.resolve(paths().publish.js)))   
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.resolve(paths().publish.js)))
    .pipe(concat(paths().publish.combineName.concat('.min.js')))
    .pipe(gulp.dest(path.resolve(paths().publish.js)));
});

// Images copy
gulp.task('pl-publish:img', function(){
  return gulp.src('**/*.*',{cwd: path.resolve(paths().public.images)} )
    .pipe(gulp.dest(path.resolve(paths().publish.images)));
});

// Favicon copy
gulp.task('pl-publish:favicon', function(){
  return gulp.src('favicon.ico', {cwd: path.resolve(paths().public.root)} )
    .pipe(gulp.dest(path.resolve(paths().publish.root)));
});

// Fonts copy
gulp.task('pl-publish:font', function(){
  return gulp.src('*', {cwd: path.resolve(paths().public.fonts)})
    .pipe(gulp.dest(path.resolve(paths().publish.fonts)));
});

// CSS Copy
gulp.task('pl-publish:css', function(){
  return gulp.src(path.resolve(paths().public.css, '*.css'))
    .pipe(gulp.dest(path.resolve(paths().publish.css)))
    .pipe(cssmin({zindex: false}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.resolve(paths().publish.css)))
    .pipe(concat(paths().publish.combineName.concat('.min.css')))
    .pipe(gulp.dest(path.resolve(paths().publish.css)));    
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
  function(done){
    done();
  })
);

gulp.task('pl-assets', gulp.series(
  gulp.parallel(
    'pl-copy:js',
    'pl-copy:img',
    'pl-copy:favicon',
    'pl-copy:font',
    'pl-stylesheets',
    'pl-copy:ajax',
    'pl-copy:vendors',        
    'pl-copy:styleguide',
    'pl-copy:styleguide-css'
  ),
  function(done){
    done();
  })
);

gulp.task('pl-publish', gulp.series(
  'pl-publish:clean',   
  gulp.parallel(
    'pl-publish:js',
    'pl-publish:img',
    'pl-publish:favicon',
    'pl-publish:font',
    'pl-publish:css'
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
  gulp.watch(path.resolve(paths().source.css, '**/*.{css,scss}'), { awaitWriteFinish: false }).on('change', gulp.series('pl-stylesheets'));
  gulp.watch(path.resolve(paths().source.js, '**/*.js'), { awaitWriteFinish: false }).on('change', gulp.series('pl-copy:js'));   
  gulp.watch(path.resolve(paths().source.styleguide, '**/*.*'), { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:styleguide', 'pl-copy:styleguide-css', reloadCSS));

  var patternWatches = [
    path.resolve(paths().source.patterns, '**/*.{json,mustache,md}'),
    path.resolve(paths().source.data, '*.json'),
    path.resolve(paths().source.ajax, '*.json'),    
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
gulp.task('patternlab:publish', gulp.series('pl-publish'));
gulp.task('serve', gulp.series('patternlab:serve'));
gulp.task('publish', gulp.series('patternlab:build', 'patternlab:publish'));