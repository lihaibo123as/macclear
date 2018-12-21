/**
 * Created by PhpStorm.
 * @author: 李海波 <lihaibo123as@163.com>
 * @date: 2018/12/14
 * @time: 2:53 PM
 */
var fs = require('fs');
var path = require('path');
nw.loadCss = function (config, callback) {
    var head = document.getElementsByTagName("head")[0];

    if (config.content) {
        var style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) { // for IE
            style.styleSheet.cssText = config.content;
        } else {
            style.innerHTML = config.content;
        }

        head.appendChild(style);
        callback && callback();
    }
    else if (config.url) {
        var link = document.createElement('link');

        link.href = config.url;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    }
}
Date.prototype.format = function (fmt) {
    var o = {
        "Y+": this.getFullYear(),
        "m+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "H+": this.getHours(),                   //小时   
        "i+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    for (var i in o) {
        if (['m+', 'd+', 'H+', 'i+', 's+'].includes(i)) {
            o[i] = (o[i] < 10 ? '0' + o[i] : o[i]);
        }
    }
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var tool = {
    msg: function (msg) {
        var driver = window.msgdriver;
        if (driver) {
            driver.alert('消息消息');
            driver.alert('消息消息', 'danger');
        } else {
            console.warn('消息驱动未初始化', window.msgdriver);
        }
    },
    uuid: function (prefix, length) {
        if (length > 0) {
            var uuid = Math.random().toString(36).substr(2);
            return (prefix ? prefix : '') + uuid.substr(uuid.length - length);
        }
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return (prefix ? prefix : '') + uuid;
    },
    demo: () => {
        return new Promise((resolve, reject) => {
            try {
                // if (err) {
                //     console.error(`出错: ${err}`);
                //     reject(err);
                //     return;
                // }
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    parsePlist: function (plistfile) {
        var { exec } = require('child_process'), fields;
        return new Promise((resolve, reject) => {
            try {
                fs.exists(plistfile, (exists) => {
                    if (exists) {
                        // fields = ['CFBundleName', 'CFBundleVersion', 'CFBundleShortVersionString', 'CFBundleIconFile', 'CFBundleIdentifier'];
                        var shcmd = `/usr/libexec/PlistBuddy -c "Print" "${plistfile}"`;
                        exec(shcmd, (err, stdout, stderr) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            // if ('/Applications/Visual Studio.app/Contents/Info.plist' == plistfile) {
                            // console.warn('plist', shcmd, plistfile, stdout);
                            // console.log('match', stdout.match(/(\S+)\s\=\s(.*)/g));
                            // }
                            // console.log('match', stdout.match(/(\S+)\s\=\s(.*)/g));
                            var temp = stdout.match(/(\S+)\s\=\s(.*)/g)
                            var params = {};
                            if (temp) {
                                temp.forEach(item => {
                                    var temprow = item.split(' = ');
                                    if (fields) {
                                        if (fields.indexOf(temprow[0]) > -1) {
                                            params[temprow[0]] = temprow[1];
                                        }
                                    } else {
                                        if (!params[temprow[0]]) {
                                            params[temprow[0]] = temprow[1];
                                        } else {
                                            // console.log('重复属性覆盖:', temprow[0], temprow[1]);
                                        }
                                    }
                                });
                            }
                            // console.log('params', params);
                            resolve(params);
                        })
                    } else {
                        reject(`文件不存在:${plistfile}`);
                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    },
    /**
     * 解析icns图标到图片
     * @param {图标} icns 
     */
    parseIcns: function (icns) {
        return new Promise((resolve, reject) => {
            try {
                var iconutil = require('iconutil');
                // console.log('iconutil', iconutil,icns);
                iconutil.toIconset(icns, function (error, icons) {
                    if (error) {
                        console.warn(`parseIcns出错: ${error},${icns}`);
                        reject(error);
                        return;
                    }
                    // console.log('icon', icons);
                    var icon;
                    if (icons['icon_128x128.png']) {
                        icon = icons['icon_128x128.png'];
                    } else if (icons['icon_256x256.png']) {
                        icon = icons['icon_256x256.png'];
                    } else if (icons['icon_512x512.png']) {
                        icon = icons['icon_512x512.png'];
                    }
                    if (icon) {
                        var base64 = 'data:image/png;base64,' + icon.toString('base64');
                        resolve(base64);
                    } else {
                        console.warn('图标不存在', icons);
                        reject('图标不存在');
                    }
                });
            } catch (error) {
                reject(error);
            }
        })
    },
    /**
     * 获取文件大小
     * @param {文件} file 
     */
    fileSize: function (file) {
        var { exec } = require('child_process');
        return new Promise((resolve, reject) => {
            try {
                fs.stat(file, function (error, stats) {
                    if (error) {
                        console.error(`stat出错: ${error}`);
                        reject(error);
                        return;
                    }
                    if (stats.isDirectory() || stats.isFile()) {
                        var shcmd = `du -h -d 0 "${file}"`;
                        exec(shcmd, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec:${shcmd}出错:${error}`);
                                return;
                            }
                            var res = stdout.trim().split(/\s+/);
                            resolve(res[0]);
                        })
                    } else {
                        reject(`目录异常:${file}}`);
                    }
                });
            } catch (error) {
                reject(error);
            }
        })
    },
    searchDirs: function (dir) {
        var filepath = path.resolve(dir);
        var files = fs.readdirSync(filepath);
        var dirs = [];
        for (var i in files) {
            var filename = files[i];
            if (/^\.(\S+)?$/.test(filename)) {
                // console.log('隐藏文件跳过:', filename);
                continue;
            }
            if (/^.*\.app$/.test(filename)) {
                continue;
            }
            var filedir = path.join(filepath, filename);
            var stats = fs.statSync(filedir);
            var isFile = stats.isFile();//是文件
            var isDir = stats.isDirectory();//是文件夹
            if (isDir) {
                dirs.push(filedir);
            }
        }
        return dirs;
    },
    /**
     * 检索指定目录 app数据
     * @param {目录} dir 
     */
    searchApp: function (dir) {
        var that = this;
        return new Promise((resolve, reject) => {
            try {
                var filepath = path.resolve(dir);
                fs.readdir(filepath, function (error, files) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    var apps = [];
                    for (var i in files) {
                        var filename = files[i];
                        if (/^\.(\S+)?$/.test(filename)) {
                            // console.log('隐藏文件跳过:', filename);
                            continue;
                        }
                        if (/^.*\.app$/.test(filename)) {
                            var filedir = path.join(filepath, filename);
                            var state = fs.statSync(filedir);
                            var appname = filename.replace('.app', '');
                            var plistpath = `${filedir}/Contents/Info.plist`;
                            apps.push({
                                name: appname,
                                plistpath: plistpath,
                                filename: filename,
                                filepath: filedir,
                                atimeMs: state.atimeMs,
                                birthtimeMs: state.birthtimeMs,
                                mtimeMs: state.mtimeMs,
                                state: state,
                            });
                        }
                    }
                    resolve(apps);
                });
            } catch (error) {
                reject(error);
            }
        })
    },
    /**
     * 获取 app详情
     * @param {searchApp=>item} app 
     */
    appInfo: function (app) {
        var appinfo = async function (app) {
            //基本信息
            var info = {
                plist: await tool.parsePlist(app.plistpath),
                size: await tool.fileSize(app.filepath),
            };
            //图标
            try {
                if (info.plist.CFBundleIconFile) {
                    var iconname = info.plist.CFBundleIconFile.replace('.icns', '');
                    info.icon = await tool.parseIcns(`${app.filepath}/Contents/Resources/${iconname}.icns`)
                }
            } catch (error) {
                console.log('图标异常:', app.name);
            }
            app.info = Object.assign({}, info, app.info);
            return app;
        };
        return appinfo(app);
    },
    searchDirFiles: function (dir, search, ignore) {
        var searpath = path.resolve(dir);
        console.log('检索目录文件:', searpath);
        var searchlist = [];
        try {
            searchFile(searpath, pushFile);
        } catch (error) {
            console.error('检索文件错误:', error.message);
        }
        /**
         * 加入队列
         * @param {*} filename 
         * @param {*} filepath 
         * @param {*} state 
         */
        function pushFile(filename, filepath, state) {
            var item = {
                name: filename,
                path: filepath,
                size: state.size,
                atimeMs: state.atimeMs,
                ctimeMs: state.ctimeMs,
                mtimeMs: state.mtimeMs,
            };
            // console.log('加入队列', item);
            searchlist.push(item);
        }
        /**
         * 递归检索目录文件
         * @param {*} filepath 
         */
        function searchFile(filepath, pushFile) {
            console.log('检索目录:', filepath);
            fs.readdir(filepath, function (err, files) {
                if (err) {
                    console.warn('readdir:', err);
                    return;
                }
                // console.log('文件列表',files);
                for (var i in files) {
                    var filename = files[i];
                    if (/^\.(\S+)?$/.test(filename)) {
                        // console.log('隐藏文件跳过:', filename);
                        continue;
                    }
                    stateFile(filepath, filename, pushFile);
                }
            });
        }
        function stateFile(filepath, filename, pushFile) {
            var filedir = path.join(filepath, filename);
            fs.stat(filedir, function (err, stats) {
                if (err) {
                    console.warn('stat', err);
                    return;
                }
                var isApp = false;
                if (/^.*\.app$/.test(filename)) {
                    isApp = true;
                }
                var isFile = stats.isFile();//是文件
                var isDir = stats.isDirectory();//是文件夹
                // console.log('filestate', stats, isFile, isDir);
                if (isFile || isApp) {
                    if (ignore) {
                        let ignoreReg = new RegExp(ignore)
                        if (ignoreReg.test(filename)) {
                            // console.log('忽略文件跳过:', filename);
                        }
                    } else {
                        if (search) {
                            let searchReg = new RegExp(search)
                            if (searchReg.test(filename)) {
                                pushFile(filename, filepath, stats);
                            } else {
                                // console.log('不匹配文件跳过:', filename);
                            }
                        } else {
                            pushFile(filename, filepath, stats);
                        }
                    }
                }
                if (isDir) {
                    console.log('递归获取文件:', filedir);
                    try {
                        setTimeout(() => {
                            searchFile(filedir, pushFile);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }, 2000);
                    } catch (error) {
                        console.warn('子目录异常:', error.message);
                    }
                }
            });
        }
    }
};
module.exports = tool;