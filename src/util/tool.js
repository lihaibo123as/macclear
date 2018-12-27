/**
 * Created by PhpStorm.
 * @author: 李海波 <lihaibo123as@163.com>
 * @date: 2018/12/14
 * @time: 2:53 PM
 */
var fs = require('fs');
var path = require('path');
var queue = require('queue');
// var util = require("util");
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
    /**
     * 消息提示
     * tool.msg(err.message, 'primary', { delay: 0 });
    tool.msg(err.message, 'success', { delay: 0 });
    tool.msg(err.message, 'info', { delay: 0 });
    tool.msg(err.message, 'warning', { delay: 0 });
     * @param {*} msg 
     * @param {*} type 
     * @param {*} config 
     */
    msg: function (msg, type, config) {
        var driver = window.msgdriver;
        if (driver) {
            driver.alert(msg, type, config);
        } else {
            console.warn('消息驱动未初始化', window.msgdriver);
        }
    },
    /**
     * 提示框
     * @param {*} config {
          show: false,
          title: "提示",
          desc: "",
          type: "info",
          value: "",
          input: false,
          ok: {title:'确定'},
          cancel: {title:'取消'}
        }
     * @returns ok:{
          value: "", //input true 的情况下用户输入的值
          input: false,
        }
     */
    confirm: function (config) {
        var driver = window.msgdriver;
        if (driver) {
            return driver.confirm(config);
        } else {
            console.warn('消息驱动未初始化', window.msgdriver);
            return Promise.reject('消息驱动未初始化');
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
    /**
     * 队列执行延迟对象
     * @param {*} group 队列分组
     * @param {*} syncfun 延迟方法
     * @param {*} args 方法参数
     * @param {*} scope  函数所在作用域
     * queue('appinfo', this.$appInfo, args);
     */
    queue: function (group, syncfun, args, scope, config) {
        this.$queueStack = this.$queueStack ? this.$queueStack : {};
        if (!this.$queueStack[group]) {
            var nqueue = queue(Object.assign({
                concurrency: 2,//并发
                timeout: 5000,//超时
                autostart: true,
            }, config));
            nqueue.on('timeout', function (next, job) {
                console.warn('队列任务超时:', job);
                next()
            })
            nqueue.on('success', function (result, job) {
                // console.log('队列完成:', result, job);
                console.warn(`队列状态,并发:${nqueue.pending},总数:${nqueue.jobs.length}`);
            })
            nqueue.on('end', function (err) {
                console.warn('队列结束:', err);
            })
            this.$queueStack[group] = nqueue;
        }
        var q = this.$queueStack[group];
        return new Promise((resolve, reject) => {
            // q.push(
            //     function (cb) {
            //         setTimeout(function () {
            //             console.log('延迟队列2000', q);
            //             cb();
            //         }, 500);
            //     }
            // )
            q.push(function (cb) {
                syncfun.apply(scope, args).then((data) => {
                    // console.log('队列完成:', syncfun, args, data);
                    resolve(data);
                    cb();
                }, (err) => {
                    // console.warn('队列失败:', syncfun, args, err);
                    reject(err);
                    cb();
                })
            });
            console.warn(`队列状态,并发:${q.pending},总数:${q.jobs.length}`);
        })
    },
    /**
     * 分装 callback to promise for async/await 使用
     * 待优化 使用  util.promisify 替代
     * @param {*} cbfun 
     * @param {*} args  函数只有一个返回值则返回当前否则返回数组
     * @param {*} scope  函数所在作用域
     */
    ctp: function (cbfun, args, scope) {
        // console.log('封装:', cbfun, args);
        return new Promise((resolve, reject) => {
            if (!cbfun) {
                reject(`驱动函数不存在:${cbfun}`)
            } else {
                args.push(function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var argus = Array.prototype.slice.call(arguments, 0);
                    argus.shift();
                    resolve(argus);
                })
                cbfun.apply(scope, args);
            }
        })
    },
    // 以下都是 async/await 方法
    /**
     * 解析 plist
     * @param {*} plistfile 
     */
    parsePlist: async function (plistfile) {
        var { exec } = require('child_process'), fields;
        await this.ctp(fs.access, [plistfile, fs.constants.F_OK]);

        // fields = ['CFBundleName', 'CFBundleVersion', 'CFBundleShortVersionString', 'CFBundleIconFile', 'CFBundleIdentifier'];
        var shcmd = `/usr/libexec/PlistBuddy -c "Print" "${plistfile}"`;
        var [stdout, stderr] = await this.ctp(exec, [shcmd]);
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
        return params;
    },
    /**
     * 解析icns图标到图片
     * @param {图标} icns 
     */
    parseIcns: async function (icns) {
        var iconutil = require('iconutil');
        // console.log('iconutil', iconutil,icns);
        var [icons] = await this.ctp(iconutil.toIconset, [icns]);
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
            return base64;
        } else {
            console.warn('图标不存在', icons);
            throw new Error('图标不存在');
        }
    },
    /**
     * 获取文件大小
     * @param {文件} file 
     */
    fileSize: async function (file) {
        var { exec } = require('child_process');
        var [stats] = await this.ctp(fs.stat, [file]);
        if (stats.isDirectory() || stats.isFile()) {
            var shcmd = `du -h -d 0 "${file}"`;
            var [stdout, stderr] = await this.ctp(exec, [shcmd]);
            return stdout.trim().split(/\s+/)[0];
        } else {
            throw new Error(`目录异常:${file}}`);
        }
    },
    /**
     * 检索指定目录 app数据
     * @param {目录} dir 
     */
    searchApp: async function (dir, subapp) {
        // console.log('检索目录:', dir);
        var filepath = path.resolve(dir);
        var [files] = await this.ctp(fs.readdir, [filepath]);
        var apps = [];
        var apptpl = {
            //app 对象基础属性
            info: {
                // size: '计算中...',
                // icon: '',
                // plist: '',
            }
        }
        for (var i in files) {
            var filename = files[i];
            if (/^\.(\S+)?$/.test(filename)) {
                // console.log('隐藏文件跳过:', filename);
                continue;
            }
            if (/^.*\.app$/.test(filename)) {
                var filedir = path.join(filepath, filename);
                let [stats] = await this.ctp(fs.stat, [filedir]);
                var appname = filename.replace('.app', '');
                var plistpath = `${filedir}/Contents/Info.plist`;
                var subapppath = `${filedir}/Contents/MacOS`;
                var subapps = [];
                if (subapp) {
                    try {
                        await this.ctp(fs.access, [subapppath, fs.constants.F_OK]);
                        subapps = await this.searchApp(subapppath);
                        // subapps.length && console.log('子应用:', subapps);
                    } catch (error) {
                        console.warn('子应用目录不存在:', error);
                    }
                }
                apps.push({
                    info: {},
                    uuid: tool.uuid(),
                    name: appname,
                    plistpath: plistpath,
                    filename: filename,
                    filepath: filedir,
                    atimeMs: stats.atimeMs,
                    birthtimeMs: stats.birthtimeMs,
                    mtimeMs: stats.mtimeMs,
                    stats: stats,
                    issubapp: !subapp,
                    subapps: subapps
                });
            }
        }
        return apps;
    },
    $removeFile: function (file, notify) {
        var shelljs = require("shelljs");
        return new Promise((resolve, reject) => {
            setTimeout(function () {
                console.log('删除文件:', file.path, file);
                var res;
                try {
                    res = shelljs.rm('-rf', file.path);
                    console.log('删除状态:', res);
                } catch (error) {
                    this.msg(`删除失败:${error}`, "danger");
                }
                Vue.set(file, 'deling', false);
                Vue.set(file, 'del', true);
                notify && notify(file);
                resolve(file);
            }, 100);
        })
    },
    removeFile: function (file, notify) {
        Vue.set(file, 'deling', true);
        console.log('删除文件:', file);
        this.queue('removeapp', this.$removeFile, [file, notify], this);
    },
    /**
     * osascript -e 'quit app \"safari\"'
     * osascript -e 'tell app "CleanMyMac X" to quit'
     * 
     * 禁用服务
     * /Library/LaunchDaemons/com.macpaw.CleanMyMac4.Agent.plist
     */
    quitApp: async function (app) {
        var { exec } = require('child_process');
        if (!app.closeing) {
            var plist = app.info.plist;
            if (plist.CFBundleName) {
                try {
                    app.closeing = true;
                    await this.ctp(exec, [`osascript -e 'quit app "${plist.CFBundleName}"'`]);
                } catch (error) {
                    app.closeing = false;
                    console.log('关闭app 失败:', error);
                }
            }
        }
        return app;
    },
    quitApps: function (apps) {
        for (var i in apps) {
            this.queue('removeapp', this.quitApp, [apps[i]], this);
        }

    },
    /**
     * 获取 app详情
     * @param {searchApp=>item} app 
     */
    appInfo: async function (app) {
        //基本信息
        var info = {
            plist: await this.parsePlist(app.plistpath),
            size: await this.fileSize(app.filepath),
        };
        //图标
        try {
            if (info.plist.CFBundleIconFile) {
                var iconname = info.plist.CFBundleIconFile.replace('.icns', '');
                info.icon = await this.parseIcns(`${app.filepath}/Contents/Resources/${iconname}.icns`)
            }
        } catch (error) {
            console.warn('图标异常:', app.name);
        }

        if (app.subapps.length) {
            for (let i in app.subapps) {
                this.queue("appinfo", this.appInfo, [app.subapps[i]], this).then(
                    newapp => {
                        newapp.loading = false;
                        console.log("子应用App 详情:", newapp.name, newapp, newapp.info);
                    },
                    err => {
                        this.msg(`子应用App:${app.name},详情异常:${err}`, "warning");
                        console.warn(`子应用App详情异常:${app.name}`, err, app);
                    }
                );
            }
        }
        app.info = Object.assign({}, info, app.info);
        return app;
    },
    /**
     * app关联文件信息
     * @param {*} app 
     * @param {*} rules 
     */
    appRules: function (app, rules) {
        var plist = app.info.plist;
        var os = require('os');
        var userpath = os.homedir();
        return new Promise((resolve, reject) => {
            // console.log('分析文件', this, app, rules);
            if (plist) {
                var filerules = [], complateRule = 0;
                var complateCb = function (rule) {
                    complateRule++;
                    // console.log('完成:', complateRule, filerules.length, app.info);
                    if (complateRule == filerules.length) {
                        resolve(app);
                    }
                }
                for (let i in rules) {
                    let rule = rules[i];
                    // console.log('获取规则文件:', rule.key, rule);
                    let temprule = Object.assign({ loading: true, files: [] }, rule);
                    let regstr, regglobal, regkey = new RegExp("__(\\w+)__", 'g'), regparm, regreplace = {};
                    if (Array.isArray(rule.reg) && rule.reg.length) {
                        regstr = rule.reg[0];
                        regglobal = rule.reg[1];
                    }
                    if (typeof rule.reg == 'string') {
                        regstr = rule.reg;
                    }
                    if (regstr) {
                        while ((regparm = regkey.exec(regstr)) != null) {
                            if (regparm[1] && plist[regparm[1]]) {
                                regreplace[regparm[0]] = plist[regparm[1]];
                                // console.log('字符替换:', regreplace);
                            }
                        }
                        for (let i in regreplace) {
                            regstr = regstr.replace(i, regreplace[i]);
                        }
                        // console.log('处理后正则:', regstr);
                        temprule.regstr = regstr;
                        temprule.regexp = new RegExp(regstr, regglobal);
                    }
                    //用户路径解析
                    temprule.path = temprule.path.replace(/^~/, userpath);
                    this.appRuleFiles(temprule, complateCb);
                    filerules.push(temprule);
                }
                // console.log('规则信息:', filerules);
                app.info.rules = filerules;
            }
            return app;
        })
    },
    appRuleFiles: function (rule, cb) {
        if (rule.regexp) {
            this.queue('apprulefiles', this.dirFiles, [rule.path, rule.regexp], this).then(function (files) {
                rule.files = files;
                // console.log('规则文件列表', rule);
                rule.loading = false;
                cb && cb(rule);
            }, function (err) {
                rule.loading = false;
                rule.err = err;
                cb && cb(rule);
            })
        } else {
            console.warn('无效规则值或者规则正则');
        }
    },
    /**
     * 检索目录文件
     * @param {*} dir 
     * @param {*} reg 
     */
    dirFiles: async function (dir, reg) {
        var filepath = path.resolve(dir);
        var [files] = await this.ctp(fs.readdir, [filepath]);
        var dirs = [];
        for (var i in files) {
            var filename = files[i];
            if (/^\.(\S+)?$/.test(filename)) {
                // console.log('隐藏文件跳过:', filename);
                continue;
            }
            let isApp = false;
            if (/^.*\.app$/.test(filename)) {
                isApp = true;
            }

            reg.lastIndex = 0;
            // console.log('匹配:', reg, filename, reg.test(filename));
            if (reg.test(filename)) {
                // console.log('匹配文件:', filename);
                let filedir = path.join(filepath, filename), isFile = false, isDir = false, size = 0;
                try {
                    await this.ctp(fs.access, [filedir, fs.constants.F_OK]);
                    var [stats] = await this.ctp(fs.stat, [filedir]);
                    isFile = stats.isFile();//是文件
                    isDir = stats.isDirectory();//是文件夹
                    size = await this.fileSize(filedir);
                } catch (error) {
                    isFile = true;
                    console.warn('文件状态异常:', error);
                }
                dirs.push({ size: size, path: filedir, isFile: isFile, isDir: isDir, stats: stats, isApp: isApp });
            }
        }
        return dirs;
    },
};
module.exports = tool;