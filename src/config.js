/**
 * Created by PhpStorm.
 * @author: 李海波 <lihaibo123as@163.com>
 * @date: 2018/12/14
 * @time: 3:25 PM
 */
module.exports = {
    name: 'nwjs',
    debug: true,
    search_path: '/Applications',
    search_deep: 1,
    //用户目录
    user_relation_dir: [
        {
            dir: '/Library',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/Application Support',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/Application Support/CrashReporter',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/Caches',
            name: '',
            level: 'info',
        },
        /**
         * vmware-vmx_97338B41-1277-55D2-8670-0476EBA0E893.plist
         * tzapp_97338B41-1277-55D2-8670-0476EBA0E893.plist
         */
        {
            dir: '/Library/Application Support/CrashReporter',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/Containers',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/LaunchAgents',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/Preferences',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/PreferencePanes',
            name: '',
            level: 'info',
        },
    ],
    //系统目录
    sys_relation_dir: [
        {
            dir: '/Library/Application Support',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/Extensions',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/LaunchAgents',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/LaunchDaemons',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/PreferencePanes',
            name: '',
            level: 'info',
        },
        {
            dir: '/Library/Preferences',
            name: '',
            level: 'info',
        },
        /**
-r-xr--r--@  1 root  wheel   58976  6 29 13:21 com.AngularTech.OsxHelper
-r-xr--r--@  1 root  wheel   44736  4 13  2016 com.baidu.netdiskmac.BDYunFinderInstaller
-r-xr--r--@  1 root  wheel  168272 11 28 11:10 com.macpaw.CleanMyMac4.Agent
-r-xr--r--@  1 root  wheel  168304 11 28 10:27 com.macpaw.zh.CleanMyMac4.Agent
-rwxr-xr-x   1 root  wheel  818576  8 15  2015 com.microsoft.office.licensingV2.helper
-r-xr--r--@  1 root  wheel  147008 11 30  2017 com.paragon-software.installer
-rwxr-xr-x   1 root  wheel  115456 12 14  2017 com.teamviewer.Helper
         */
        {
            dir: '/Library/PrivilegedHelperTools',
            name: '',
            level: 'info',
        },
        /**
        drwxrwxr-x   3 root     wheel    96  3 18  2014 360yunpanInjector.osax
        drwxrwxr-x   3 root     wheel    96  6 29  2016 Adobe Unit Types.osax
        drwxr-xr-x@  3 lihaibo  admin    96  7 27  2015 BDYunFinderInjector.osax
        */
        {
            dir: '/Library/ScriptingAdditions',
            name: '',
            level: 'warning',
        },
        /**
         * com.macpaw.CleanMyMac4.Agent.plist
         */
        {
            dir: '/Library/LaunchDaemons',
            name: '服务',
            level: 'danger',
        },

    ],
    quit_app: "osascript -e 'quit app \"safari\"'"
};