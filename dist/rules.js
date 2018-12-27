/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件.
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 27, 2018
 */
/**
 * 检索 app 规则配置
 */
module.exports = {
    apppath: '/Applications',
    rules: [
        {
            path: '/Applications',
            title: '应用',
            style: 'info',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__)\.app?', 'i'],//正则数据 切勿使用 g,字段替换未 plist 内存在值
        },
        //系统资源库
        {
            path: '/Library',
            title: '系统资源库',
            style: 'danger',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],//正则数据
        },
        {
            path: '/Library/Logs',
            title: '日志文件',
            style: 'warning',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],//正则数据
        },
        {
            path: '/Library/Extensions',
            title: '',
            style: 'warning',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],//正则数据
        },
        {
            path: '/Library/Preferences',
            title: '系统支持文件',
            style: 'warning',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],//正则数据
        },
        {
            path: '/Library/PreferencePanes',
            title: '系统支持文件',
            style: 'warning',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],//正则数据
        },
        {
            path: '/Library/LaunchAgents',
            title: '系统启动配置',
            style: 'warning',
            reg: ['^(__CFBundleIdentifier__).*?', 'i'],//正则数据
        },
        {
            path: '/Library/LaunchDaemons',
            title: '系统守护配置',
            style: 'warning',
            reg: ['^(__CFBundleIdentifier__).*?', 'i'],//正则数据
        },
        {
            path: '/Library/Logs/DiagnosticReports',
            title: '日志文件',
            style: 'warning',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],//正则数据
        },
        //用户资源库
        {
            path: '~/Library',
            title: '资源库',
            style: 'warning',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },

        {
            path: '~/Library/LaunchAgents',
            title: '启动配置',
            style: 'warning',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/Containers',
            title: '容器',
            style: 'danger',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/Saved Application State',
            title: '应用存储状态',
            style: 'success',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/Application Support',
            title: '支持文件',
            style: 'success',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/Application Scripts',
            title: '支持文件',
            style: 'success',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/Preferences',
            title: '偏好设置',
            style: 'success',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/PreferencePanes',
            title: '',
            style: 'success',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/Cookies',
            title: 'Cookie',
            style: 'success',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/Caches',
            title: '缓存',
            style: 'success',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
        {
            path: '~/Library/Application Support/CrashReporter',
            title: '崩溃日志',
            style: 'warning',
            reg: ['^(__CFBundleName__|__CFBundleIdentifier__).*?', 'i'],
        },
    ]
}