/**
 * Created by PhpStorm.
 * @author: 李海波 <lihaibo123as@163.com>
 * @date: 2018/12/14
 * @time: 2:53 PM
 */
var os = require('os');
os.debug = function () {
    if (os) {
        os.osinfo = {};
        for (var i in os) {
            if (/^(set|get|debug|tmpD).*$/.test(i)) {
                continue;
            }
            if (typeof os[i] == 'function') {
                os.osinfo[i] = os[i]();
            }
        }
    }
    var win = nw.Window.get();
    win.showDevTools();
}
module.exports = os;