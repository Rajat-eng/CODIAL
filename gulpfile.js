// install. gulp-cli 
// install gulp
const gulp=require('gulp');

// install gulp sass

const sass = require('gulp-sass')(require('sass'));

const minify=require('gulp-minify');

// install gulp-cssnano

const cssnano=require('gulp-cssnano');

// install gulp-rev
const rev=require('gulp-rev');

// imagemin

//const image_min = require('gulp-imagemin');


gulp.task('css',function(done){
    console.log('minify css');
    gulp.src('./assets/scss/*.scss')
    .pipe(sass()) // convert sass to css  // pipe is miidlware to call the labs
    .pipe(cssnano()) // minify css 
    .pipe(gulp.dest('./assets/css')); // move compresses css to css folder

     gulp.src('./assets/**/*.css')    // rewrite css files to public assets
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({ // manifest is to cretae a map
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets')) // wrote manifest to public
    done();
})




gulp.task('minifyjs',function(done){
    console.log('minifying js');
    gulp.src('./assets/**/*.js')
    .pipe(minify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'))
    done();
})



// gulp.task('images',function(done){
//     console.log('compressing images');
//     gulp.src('./assets/**/*.+(pnh|jpg|gif|svh|jpeg)')
//     .pipe(image_min())
//     .pipe(rev())
//     .pipe(gulp.dest('./public/assets'))
//     .pipe(rev.manifest({
//         cwd:'public',
//         merge:true
//     }))
//     .pipe(gulp.dest('./public/assets'))
//     done();
// })

// gulp.task('clean:assets',function(done){
//     del.deleteSync('./public/assets')
//     done();
// })

// gulp.task('build' , gulp.series('clean:assets' , 'css' , 'js' , 'images') , function(done){
//     console.log("Building Assets !");
//     done();
// })




