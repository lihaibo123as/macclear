const gulp = require('gulp'),
    path = require('path'),
    date = new Date().getTime(),
    babel = require("gulp-babel"),
    foal = require('gulp-foal')(),
    imagemin = require('gulp-imagemin'),//图片压缩
    colors = require('colors'),
    less = require('gulp-less'),
    header = require('gulp-header'),
    uglify = require('gulp-uglify-es').default,
    minifyCSS = require('gulp-minify-css'),
    fs = require('fs'), //无法
    htmlmin = require('gulp-htmlmin'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    through = require('through2'),
    rename = require('gulp-rename'),
    VueModule = require('./ext/vue-module'),
    paths = {
        source: {
            ignore: "!./src/css/font-awesome-4.7.0/",
            src: "./src/",
            dist: "./dist/",
        }
    },
    site = {
        pkg: require('./package.json'),
        banner: [
            '/**',
            ' * <%= pkg.name %> <%= pkg.version %>',
            ' * <%= pkg.description %>',
            ' * Copyright (c) <%= date.year %> <<%= pkg.author %>>',
            ' * MIT License - http://opensource.org/licenses/mit-license.php',
            ' * Released on: <%= date.month %> <%= date.day %>, <%= date.year %>',
            ' */',
            ''].join('\n'),
        strict: "",
        date: {
            year: new Date().getFullYear(),
            month: ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()],
            day: new Date().getDate()
        }
    },
    uglifyConfig = { toplevel: true },
    minHtmlOptions = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        // minifyJS: true,//压缩页面JS
        // minifyCSS: true//压缩页面CSS
    },
    vueModuleConfig = {
        debug: false,             // Debug mode
        amd: false,             // AMD style, Define module name and deps
        define: false,              // Using define() wrapper the module, false for Node.js (CommonJS style)
        defineName: false,             // Define the module name
        indent: '    ',            // Indent whitespace
        headerComment: true,              // Using <header-comment> Insert the header comments
        templateReplaceTag: '__template__',    // vue component template replace tag
        loadCSSMethod: "nw.loadCss", // define the load css method for require
        externalRequire: false              // don't pass require as a parameter
    };

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red',
    add: 'blue',
    change: 'green',
    unlink: 'red'
});
var errrHandler = function (e) {
    // 控制台发声,错误时beep一下
    console.warn('异常错误:', e);
    this.emit('end');
}
console.log('[开始执行]'.info);
var tfs = { debug: false };
foal.bindTo(tfs);
foal.task('less', (src, dist) => {
    // console.log('[less]'.info, src, dist);
    gulp.src(src, { base: '.' }).pipe(less())
        .pipe(header(site.banner, { pkg: site.pkg, date: site.date }))
        .pipe(gulp.dest('./'));
});
foal.task('image', (src, dist) => {
    // console.log('[image]'.info, src, dist);
    gulp.src(src).pipe(plumber({ errorHandler: errrHandler }))
        .pipe(imagemin())
        .pipe(gulp.dest(dist));
});
foal.task('js', (src, dist) => {
    // console.log('[js]'.info, src, dist);
    gulp.src(src).pipe(plumber({ errorHandler: errrHandler }))
        // .pipe(babel())
        .pipe(uglify(uglifyConfig))
        .pipe(header(site.banner + site.strict, { pkg: site.pkg, date: site.date }))
        .pipe(gulp.dest(dist));
});
foal.task('css', (src, dist) => {
    // console.log('[css]'.info, src, dist);
    gulp.src(src).pipe(plumber({ errorHandler: errrHandler }))
        .pipe(minifyCSS())
        .pipe(header(site.banner, { pkg: site.pkg, date: site.date }))
        .pipe(gulp.dest(dist));
});
foal.task('html', (src, dist) => {
    // console.log('[html]'.info, src, dist);
    gulp.src(src).pipe(htmlmin(minHtmlOptions))
        .pipe(gulp.dest(dist));
});

foal.task('text', (src, dist) => {
    // console.log('[html]'.info, src, dist);
    gulp.src(src).pipe(gulp.dest(dist));
});
foal.task('vue', (src, dist) => {
    // console.log('[vue]'.info, src, dist);
    gulp.src(src).pipe(VueModule(vueModuleConfig))
        .pipe(header(site.banner + site.strict, { pkg: site.pkg, date: site.date }))
        .pipe(rename({ extname: ".js" }))
        .pipe(gulp.dest(dist));
});
/**
 * 文件处理驱动
 */
foal.task('driver', (src, dist) => {
    var ext = path.extname(src);
    if (/^\.vue$/.test(ext)) {
        return foal.run(tfs.vue(src, dist));
    }
    if (/^\.less$/.test(ext)) {
        return foal.run(tfs.less(src, dist));
    }
    if (/^\.(png|jpg|gif)$/.test(ext)) {
        return foal.run(tfs.image(src, dist));
    }
    if (/^\.js$/.test(ext)) {
        return foal.run(tfs.js(src, dist));
    }
    if (/^\.(html|htm)$/.test(ext)) {
        return foal.run(tfs.html(src, dist));
    }
    if (/^\.css$/.test(ext)) {
        return foal.run(tfs.css(src, dist));
    }
    if (/^\.(json|txt)/.test(ext)) {
        return foal.run(tfs.text(src, dist));
    }
    if (/^\.(php)/.test(ext)) {
        return;
    }
    console.log('[未处理扩展名]'.warn, src);
})
/**
 * 处理yinyl 格式回掉数据流
 */
foal.task('yinyl',
    /**
     *
     * @param yinyl 文件对象
     * @param srcPath 绝对路径
     * @param baseDistPath 绝对路径
     */
    (yinyl, srcPath, baseDistPath) => {
        // for (var i in yinyl) {
        //     console.log(i + '=>', yinyl[i]);
        // }
        // console.log('路径:', yinyl.base,baseDistPath);
        // return;
        var basePath = path.resolve(yinyl.base + path.sep) + path.sep;
        if (srcPath == basePath) {
            for (var i in yinyl.history) {
                var srcFile = yinyl.history[i];
                var srcFileMin = srcFile.replace(yinyl.cwd + path.sep, "");
                var distFileMin = srcFile.replace(basePath, "");
                var distFile = baseDistPath + distFileMin;
                var distPath = path.dirname(distFile);
                var logmsg = `[编译]:`.info;
                if (yinyl.event) {
                    // console.log(`[事件:${yinyl.event}]:`.warn, srcFile, distFile);
                    // return;
                    switch (yinyl.event) {
                        case "change":
                            logmsg = colors[yinyl.event]("[修改]");
                            // console.log(colors[yinyl.event]("[修改]"), distFile);
                            break;
                        case "add":
                            logmsg = colors[yinyl.event]("[新增]");
                            // console.log(colors[yinyl.event]("[新增]"), distFile);
                            break;
                        case "unlink":
                            logmsg = colors[yinyl.event]("[删除]");
                            // console.log(colors[yinyl.event]("[删除]"), distFile);
                            break;
                        default:
                            console.log('[未处理状态]:'.warn, yinyl.event, distFile);
                            break;
                    }
                }
                console.log(logmsg, srcFileMin);
                if (yinyl.stat) {
                    foal.run(tfs.driver(srcFile, distPath))
                } else {
                    fs.unlinkSync(distFile);
                }
            }
        } else {
            console.log('yinyl 基础目录未匹配:', basePath, srcPath);
        }
    });

foal.task('parse',
    /**
     * 解析模块
     * @param model 模块配置
     * @param ext 解析类型
     * @param watchFlag 是否对模块开启监听
     */
    (model, ext = '**/*', watchFlag) => {
        var srcPath = path.resolve(model.src) + path.sep;
        var distPath = path.resolve(model.dist) + path.sep;
        var srcArr = [model.src + ext];
        if (model.ignore) {
            srcArr.push(model.ignore + ext);
        }
        if (watchFlag) {
            console.log('[监听配置]'.help, srcArr);
            watch(srcArr, function (yinyl) {
                foal.run(tfs.yinyl(yinyl, srcPath, distPath))
            });
        } else {
            console.log('[编译配置]'.help, srcArr);
            gulp.src(srcArr)
                .pipe(through.obj(function (yinyl, enc, cb) {
                    foal.run(tfs.yinyl(yinyl, srcPath, distPath));
                    cb();
                }));
        }
    })

gulp.task('source', () => {
    foal.run(tfs.parse(paths.source, "**/*.*"));
});
gulp.task('source_watch', () => {
    foal.run(tfs.parse(paths.source, "**/*.*", true));
});

gulp.task('watch', ['source', 'source_watch']);
gulp.task('default', ['source']);