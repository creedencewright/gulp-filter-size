# gulp-filter-size
gulp plugin for filtering files by size

`npm i -S gulp-filter-size`

##Usage##
```
var filterSize = require('gulp-filter-size');
gulp.src('files/*.*')
  .pipe(filterSize(1000)) // maxsize in bytes. Object is fine too {min: 100, max: 500}
  ...
```
`
