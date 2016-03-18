// Special thanks to oscar-g (https://github.com/oscar-g) for starting this at https://github.com/oscar-g/patternlab-node/tree/dev-gulp

var pkg = require('./package.json'),
    gulp = require('gulp'),
    path = require('path'),
    eol = require('os').EOL,
    del = require('del'),
    strip_banner = require('gulp-strip-banner'),
    header = require('gulp-header'),
    nodeunit = require('gulp-nodeunit'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssnano');
    rename = require('gulp-rename');
    sassLint = require('gulp-sass-lint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    spawn = require('child_process').spawn,
    browserSync = require('browser-sync').create();

require('gulp-load')(gulp);
var banner = [ '/** ',
  ' * <%= pkg.name %> - v<%= pkg.version %> - <%= today %>',
  ' * ',
  ' * <%= pkg.author %>, and the web community.',
  ' * Licensed under the <%= pkg.license %> license.',
  ' * ',
  ' * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice.',
  ' * ', ' **/'].join(eol);

function paths() {
    return require('./patternlab-config.json').paths;
}

//load patternlab-node tasks
gulp.loadTasks(__dirname+'/node_modules/patternlab-node/builder/patternlab_gulp.js');

// The config and the Pattern Lab itself
var config = require('./patternlab-config.json'),
    pl = require('patternlab-node')(config);

gulp.task('patternlab', ['prelab'], function (done) {
  pl.build(true);
  done();
});

//clean patterns dir
gulp.task('clean', function(cb){
  del.sync(['./public/patterns/*'], {force: true});
  cb();
})

//build the banner
gulp.task('banner', function(){
  return gulp.src([
    './node_modules/patternlab-node/core/lib/patternlab.js',
    './node_modules/patternlab-node/core/lib/object_factory.js',
    './node_modules/patternlab-node/core/lib/lineage_hunter.js',
    './node_modules/patternlab-node/core/lib/media_hunter.js',
    './node_modules/patternlab-node/core/lib/patternlab_grunt.js',
    './node_modules/patternlab-node/core/lib/patternlab_gulp.js',
    './node_modules/patternlab-node/core/lib/parameter_hunter.js',
    './node_modules/patternlab-node/core/lib/pattern_exporter.js',
    './node_modules/patternlab-node/core/lib/pattern_assembler.js',
    './node_modules/patternlab-node/core/lib/pseudopattern_hunter.js',
    './node_modules/patternlab-node/core/lib/list_item_hunter.js',
    './node_modules/patternlab-node/core/lib/style_modifier_hunter.js'
  ])
    .pipe(strip_banner())
    .pipe(header( banner, {
      pkg : pkg,
      today : new Date().getFullYear() }
    ))
    .pipe(gulp.dest('./node_modules/patternlab-node/core/lib'));
})

//copy tasks
gulp.task('cp:js', function(){
  return gulp.src('**/*.js', {cwd:'./source/js'})
    .pipe(gulp.dest('./public/js'))
});
gulp.task('cp:img', function(){
  return gulp.src(
    [ '**/*.svg', '**/*.gif', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.ico'  ],
    {cwd:'./source/images'} )
    .pipe(gulp.dest('./public/images'))
});
gulp.task('cp:favicon', function(){
  return gulp.src([ 'favicon.ico' ], {cwd:'./source'})
    .pipe(gulp.dest('./public'))
});
gulp.task('cp:font', function(){
  return gulp.src('*', {cwd:'./source/fonts'})
    .pipe(gulp.dest('./public/fonts'))
});
gulp.task('cp:data', function(){
  return gulp.src('annotations.js', {cwd:'./source/_data'})
    .pipe(gulp.dest('./public/data'))
})
gulp.task('cp:ajax', function(){
  return gulp.src('*.json', {cwd:'./source/_ajax'})
    .pipe(gulp.dest('./public/ajax'))
})
gulp.task('cp:css', function(){
  return gulp.src('./source/css/style.css')
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
})

// Styleguide Copy
gulp.task('cp:styleguide', function () {
  return gulp.src(
      ['**/*'],
      {cwd: path.resolve(paths().source.styleguide)})
      .pipe(gulp.dest(path.resolve(paths().public.styleguide)))
      .pipe(browserSync.stream());
});

gulp.task('cp:vendor', function(){
  return gulp.src('**/*', {cwd:'./vendor'})
    .pipe(gulp.dest('./public/vendor'))
});
gulp.task('dist:clean', function(){
  del.sync(['./dist/*'], {force: true});
})
gulp.task('dist:assets', function(){
  return gulp.src(['{fonts,images}/**/*', 'favicon.ico'], {cwd:'./public'})
    .pipe(gulp.dest('./dist'))
})
gulp.task('dist:css', function(){
  return gulp.src('**/*.css', {cwd:'./public/css'})
    .pipe(gulp.dest('./dist/css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'))
})
gulp.task('dist:js', function(){
  return gulp.src('**/*', {cwd:'./public/js'})
    .pipe(gulp.dest('./dist/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(concat('app_all.min.js'))
    .pipe(gulp.dest('./dist/js'))
})

//server and watch tasks
gulp.task('connect', ['lab'], function(){
  browserSync.init({
    server: {
      baseDir: './public/'
    }
  });
  gulp.watch('./source/css/style.css', ['cp:css']);
  gulp.watch(path.resolve(paths().source.styleguide, '**/*.*'), ['cp:styleguide']);
  gulp.watch('./source/js/**/*.js', ['cp:js']);
  gulp.watch('./source/_ajax/**/*.json', ['cp:ajax']);

  //suggested watches if you use scss
  gulp.watch('./source/css/**/*.scss', ['sass:style']);

  gulp.watch([
    './source/_patterns/**/*.mustache',
    './source/_patterns/**/*.json',
    './source/_data/*.json',
    './source/_patternlab-files/pattern-header-footer/*.html'],
     ['lab-pipe'], function(){
       browserSync.reload();
     });

})

//unit test
gulp.task('nodeunit', function(){
  return gulp.src('./test/**/*_tests.js')
    .pipe(nodeunit());
})

//sass tasks, turn on if you want to use
gulp.task('sass:style', function(){
  return gulp.src('./source/css/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 8
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
})

gulp.task('validate:sass', function() {
  gulp.src('./**/*.scss')
  .pipe(sourcemaps.write())
  .pipe(sassLint())
  .pipe(sassLint.format())
})

gulp.task('lab-pipe', ['lab'], function(cb){
  cb();
  browserSync.reload();
})

gulp.task('default', ['lab']);

gulp.task('assets', ['cp:js', 'cp:img', 'cp:favicon','cp:font', 'cp:vendor', 'cp:data', 'cp:ajax', 'sass:style', 'cp:styleguide']);
gulp.task('prelab', ['clean', 'banner', 'assets']);
gulp.task('lab', ['prelab', 'patternlab'], function(cb){cb();});
gulp.task('patterns', ['patternlab:only_patterns']);
gulp.task('serve', ['lab', 'connect']);
gulp.task('travis', ['lab', 'nodeunit']);
gulp.task('dist', ['dist:clean', 'dist:assets', 'dist:css', 'dist:js']);
gulp.task('publish', ['lab', 'dist']);

gulp.task('version', ['patternlab:version']);
gulp.task('help', ['patternlab:help']);
