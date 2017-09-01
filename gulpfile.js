/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
 ******************************************************/
var gulp = require('gulp'),
  babel = require('gulp-babel'),
  path = require('path'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
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
  argv = require('minimist')(process.argv.slice(2)),
  shell = require('gulp-shell'),
  fs = require('fs');

/******************************************************
 * COPY TASKS - stream assets from source to public
 ******************************************************/

// CSS Copy
gulp.task('pl-copy:css', function() {
  return gulp
    .src(path.resolve(paths().source.css, '*.css'))
    .pipe(sourcemaps.init())
    .pipe(concat(paths().bundle.name + '.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream());
});

// Images copy
gulp.task('pl-copy:img', function() {
  return gulp
    .src('**/*.{ico,png,gif,jpg,jpeg,svg,tif,bmp,ico}', {
      cwd: path.resolve(paths().source.images),
    })
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(gulp.dest(path.resolve(paths().public.images)));
});

// Favicon copy
gulp.task('pl-copy:favicon', function() {
  return gulp
    .src('*.{ico,png,gif,jpg,jpeg,svg}', {
      cwd: path.resolve(paths().source.root),
    })
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(gulp.dest(path.resolve(paths().public.root)));
});

// Fonts copy
gulp.task('pl-copy:font', function() {
  return gulp
    .src('**/*.{svg,eot,ttf,woff,otf,woff2}', {
      cwd: path.resolve(paths().source.fonts),
    })
    .pipe(gulp.dest(path.resolve(paths().public.fonts)));
});

// AJAX Copy
gulp.task('pl-copy:ajax', function() {
  return gulp
    .src(path.resolve(paths().source.ajax, '**/*'))
    .pipe(gulp.dest(path.resolve(paths().public.ajax)));
});

// Components Copy
gulp.task('pl-copy:components', function() {
  return gulp
    .src('**/*.*', {
      cwd: path.resolve(paths().source.components)
    })
    .pipe(gulp.dest(path.resolve(paths().public.components)));
});

// Modules copy
gulp.task('pl-copy:modules', function(done) {
  Object.keys(packageConfig.dependencies).forEach(function(dependency) {
    gulp.src('**/*.*', {
        cwd: paths().source.modules + "/" + dependency
      })
      .pipe(gulp.dest(paths().public.root + "/" + paths().source.modules + "/" + dependency));
  });
  done();
});

// Styleguide Copy everything but css
gulp.task('pl-copy:styleguide', function() {
  return gulp
    .src(path.resolve(paths().source.styleguide, '**/!(*.css)'))
    .pipe(gulp.dest(path.resolve(paths().public.root)))
    .pipe(browserSync.stream());
});

// Styleguide Copy and flatten css
gulp.task('pl-copy:styleguide-css', function() {
  return gulp
    .src(path.resolve(paths().source.styleguide, '**/*.css'))
    .pipe(
      gulp.dest(function(file) {
        //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
        file.path = path.join(file.base, path.basename(file.path));
        return path.resolve(path.join(paths().public.styleguide, 'css'));
      })
    )
    .pipe(browserSync.stream());
});

/******************************************************
 * COMPILE TASKS - Compile assets
 ******************************************************/
// Compile Javascript
gulp.task('pl-compile:js', function() {
  return gulp
    .src('*.js', {
      cwd: path.resolve(paths().source.js)
    })
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['env'],
      })
    )
    .pipe(concat(paths().bundle.name + '.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.resolve(paths().public.js)))
    .pipe(browserSync.stream({
      match: '**/*.js'
    }));
});

// Compile Sass
gulp.task('pl-compile:sass', function() {
  return gulp
    .src('*.scss', {
      cwd: path.resolve(paths().source.css)
    })
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
        precision: 8,
      })
    )
    .pipe(concat(paths().bundle.name + '.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }));
});

gulp.task('pl-compile:stylus', function() {
  return gulp
    .src('*.styl', {
      cwd: path.resolve(paths().source.css)
    })
    .pipe(sourcemaps.init())
    .pipe(stylint())
    .pipe(stylus())
    .pipe(concat(paths().bundle.name + '.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }));
});

/******************************************************
 * VALIDATE TASKS - Validate preprocessors
 ******************************************************/
// Validate Sass
gulp.task('pl-validate:sass', function() {
  return gulp
    .src('**/*.scss', {
      cwd: path.resolve(paths().source.css)
    })
    .pipe(sassLint())
    .pipe(sassLint.format());
});

// Validate CSS
gulp.task('pl-validate:css', function() {
  return gulp
    .src('**/*.css', {
      cwd: path.resolve(paths().source.css)
    })
    .pipe(cssLint())
    .pipe(cssLint.format());
});

// Validate Stylus
gulp.task('pl-validate:stylus', function() {
  return gulp
    .src('**/*.styl', {
      cwd: path.resolve(paths().source.css)
    })
    .pipe(stylint())
    .pipe(stylint.reporter());
});

/******************************************************
 * CLEAN TASKS - Clean assets
 ******************************************************/
// Clean
gulp.task('pl-clean:bundle', function() {
  return del([path.resolve(paths().bundle.root) + '**/*']);
});

gulp.task('pl-clean:build', function() {
  return del([path.resolve(paths().public.root) + '**/*']);
});

/**************************************************************
 * BUNDLE TASKS - stream assets from public to bundle directory
 ***************************************************************/
// JS copy
gulp.task('pl-bundle:js', function() {
  gulp
    .src('**/*.js', {
      cwd: path.resolve(paths().public.js)
    })
    .pipe(gulp.dest(path.resolve(paths().bundle.js)))
    .pipe(concat(paths().bundle.name + '.js'))
    .pipe(gulp.dest(path.resolve(paths().bundle.js)));

  return gulp
    .src('**/*.js', {
      cwd: path.resolve(paths().public.js)
    })
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.resolve(paths().bundle.js)))
    .pipe(concat(paths().bundle.name + '.min.js'))
    .pipe(gulp.dest(path.resolve(paths().bundle.js)));
});

// Images copy
gulp.task('pl-bundle:img', function() {
  return gulp
    .src('**/*.{ico,png,gif,jpg,jpeg,svg,tif,bmp,ico}', {
      cwd: path.resolve(paths().public.images),
    })
    .pipe(gulp.dest(path.resolve(paths().bundle.images)));
});

// Favicon copy
gulp.task('pl-bundle:favicon', function() {
  return gulp
    .src('*.{ico,png,gif,jpg,jpeg,svg}', {
      cwd: path.resolve(paths().public.root),
    })
    .pipe(gulp.dest(path.resolve(paths().bundle.root)));
});

// Fonts copy
gulp.task('pl-bundle:font', function() {
  return gulp
    .src('**/*.{svg,eot,ttf,woff,otf,woff2}', {
      cwd: path.resolve(paths().public.fonts),
    })
    .pipe(gulp.dest(path.resolve(paths().bundle.fonts)));
});

// CSS Copy
gulp.task('pl-bundle:css', function() {
  gulp
    .src(path.resolve(paths().public.css, '*.css'))
    .pipe(gulp.dest(path.resolve(paths().bundle.css)))
    .pipe(concat(paths().bundle.name + '.css'))
    .pipe(gulp.dest(path.resolve(paths().bundle.css)));

  return gulp
    .src(path.resolve(paths().public.css, '*.css'))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.resolve(paths().bundle.css)))
    .pipe(concat(paths().bundle.name + '.min.css'))
    .pipe(gulp.dest(path.resolve(paths().bundle.css)));
});

// Components bundle
gulp.task('pl-bundle:components', function() {
  return gulp
    .src('**/*.*', {
      cwd: path.resolve(paths().public.components)
    })
    .pipe(gulp.dest(path.resolve(paths().bundle.components)));
});

/******************************************************
 * PATTERN LAB CONFIGURATION - API with core library
 ******************************************************/
//read all paths from our namespaced config file
var config = JSON.parse(fs.readFileSync('./patternlab-config.json')),
  packageConfig = JSON.parse(fs.readFileSync('./package.json')),
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

gulp.task(
  'pl-stylesheets',
  gulp.series('pl-copy:css', 'pl-compile:sass', 'pl-compile:stylus', function(
    done
  ) {
    done();
  })
);

gulp.task(
  'pl-scripts',
  gulp.series('pl-compile:js', function(done) {
    done();
  })
);

gulp.task(
  'pl-assets',
  gulp.series(
    gulp.parallel(
      'pl-stylesheets',
      'pl-scripts',
      'pl-copy:img',
      'pl-copy:favicon',
      'pl-copy:font',
      'pl-copy:ajax',
      'pl-copy:components',
      'pl-copy:modules',
      'pl-copy:styleguide',
      'pl-copy:styleguide-css'
    ),
    function(done) {
      done();
    }
  )
);

gulp.task(
  'pl-bundle',
  gulp.series(
    gulp.parallel(
      'pl-bundle:js',
      'pl-bundle:img',
      'pl-bundle:favicon',
      'pl-bundle:font',
      'pl-bundle:css',
      'pl-bundle:components'
    ),
    function(done) {
      done();
    }
  )
);

gulp.task(
  'pl-clean',
  gulp.series(gulp.parallel('pl-clean:build', 'pl-clean:bundle'), function(
    done
  ) {
    done();
  })
);

gulp.task('patternlab:version', function(done) {
  patternlab.version();
  done();
});

gulp.task('patternlab:help', function(done) {
  patternlab.help();
  done();
});

gulp.task('patternlab:patternsonly', function(done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
});

gulp.task('patternlab:liststarterkits', function(done) {
  patternlab.liststarterkits();
  done();
});

gulp.task('patternlab:loadstarterkit', function(done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
});

gulp.task(
  'pl-build',
  gulp.series('pl-assets', build, function(done) {
    done();
  })
);

/******************************************************
 * TESTS TASKS
 ******************************************************/
//unit test
gulp.task('pl-nodeunit', function() {
  return gulp.src('./test/**/*_tests.js').pipe(nodeunit());
});

/******************************************************
 * SERVER AND WATCH TASKS
 ******************************************************/
// watch task utility functions
function getSupportedTemplateExtensions() {
  var engines = require('./node_modules/patternlab-node/core/lib/pattern_engines');
  return engines.getSupportedFileExtensions();
}

function getTemplateWatches() {
  return getSupportedTemplateExtensions().map(function(dotExtension) {
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
  gulp
    .watch(path.resolve(paths().source.css, '**/*.styl'), {
      awaitWriteFinish: false,
    })
    .on('change', gulp.series('pl-compile:stylus'));
  gulp
    .watch(path.resolve(paths().source.css, '**/*.css'), {
      awaitWriteFinish: false,
    })
    .on('change', gulp.series('pl-copy:css'));
  gulp
    .watch(path.resolve(paths().source.css, '**/*.scss'), {
      awaitWriteFinish: false,
    })
    .on('change', gulp.series('pl-compile:sass'));
  gulp
    .watch(path.resolve(paths().source.js, '**/*.js'), {
      awaitWriteFinish: false,
    })
    .on('change', gulp.series('pl-compile:js'));
  gulp
    .watch(path.resolve(paths().source.ajax, '**/*'), {
      awaitWriteFinish: false,
    })
    .on('change', gulp.series('pl-copy:ajax'));
  gulp
    .watch(path.resolve(paths().source.styleguide, '**/*.*'), {
      awaitWriteFinish: true,
    })
    .on(
      'change',
      gulp.series('pl-copy:styleguide', 'pl-copy:styleguide-css', reloadCSS)
    );

  var patternWatches = [
    path.resolve(paths().source.patterns, '**/*.{json,mustache,md}'),
    path.resolve(paths().source.data, '*.json'),
    path.resolve(paths().source.fonts + '/*'),
    path.resolve(paths().source.images + '/*'),
    path.resolve(paths().source.meta, '*'),
    path.resolve(paths().source.annotations + '/*'),
  ].concat(getTemplateWatches());

  gulp
    .watch(patternWatches, {
      awaitWriteFinish: false
    })
    .on('change', gulp.series(build, reload));
}

gulp.task(
  'patternlab:connect',
  gulp.series(function(done) {
    browserSync.init({
        server: {
          baseDir: path.resolve(paths().public.root),
        },
        snippetOptions: {
          // Ignore all HTML files within the templates folder
          blacklist: ['/index.html', '/', '/?*'],
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
            'text-align: center',
          ],
        },
      },
      function() {
        console.log('PATTERN LAB NODE WATCHING FOR CHANGES');
        done();
      }
    );
  })
);

/******************************************************
 * COMPOUND TASKS
 ******************************************************/
gulp.task('default', gulp.series('pl-build'));
gulp.task('patternlab:watch', gulp.series('pl-build', watch));
gulp.task('patternlab:clean', gulp.series('pl-clean'));
gulp.task('patternlab:build', gulp.series('pl-clean:build', 'pl-build'));
gulp.task('patternlab:serve', gulp.series('patternlab:build', 'patternlab:connect', watch));
gulp.task('patternlab:bundle', gulp.series('patternlab:build', 'pl-clean:bundle', 'pl-bundle'));
gulp.task('serve', gulp.series('patternlab:serve'));
gulp.task('clean', gulp.series('patternlab:clean'));
gulp.task('build', gulp.series('patternlab:build'));
gulp.task('bundle', gulp.series('patternlab:bundle'));

/******************************************************
 * UTILITY TASKS
 ******************************************************/
gulp.task(
  'git:push',
  shell.task([
    'git add -A .',
    'git commit -am "' + argv.m + '"',
    'git pull',
    'git push',
  ])
);
