/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Author lihaibo123as@163.com
 * Licensed under ISC
 * Released on: December 21, 2018
 */
var o=require("os");o.debug=function(){if(o)for(var e in o.osinfo={},o)/^(set|get|debug|tmpD).*$/.test(e)||"function"==typeof o[e]&&(o.osinfo[e]=o[e]());nw.Window.get().showDevTools()},module.exports=o;