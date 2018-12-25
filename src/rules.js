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
            key: 'CFBundleName',
            reg: ['^__key__\.app?', 'i'],//正则数据 切勿使用 g
        },
        //系统资源库
        {
            path: '/Library',
            title: '系统资源库',
            style: 'warning',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'i'],//正则数据
        },
        //系统资源库
        {
            path: '/Library/Logs',
            title: '日志文件',
            style: 'warning',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'i'],//正则数据
        },
        {
            path: '/Library/Logs/DiagnosticReports',
            title: '日志文件',
            style: 'warning',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'i'],//正则数据
        },
        // //用户资源库
        {
            path: '~/Library',
            title: '资源库',
            style: 'success',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library',
            title: '资源库',
            style: 'success',
            key: 'CFBundleIdentifier',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library/LaunchAgents',
            title: '启动文件',
            style: 'success',
            key: 'CFBundleIdentifier',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library/Application Support/CrashReporter',
            title: '支持文件',
            style: 'success',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library/Application Support',
            title: '支持文件',
            style: 'success',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library/Application Support',
            title: '支持文件',
            style: 'success',
            key: 'CFBundleIdentifier',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library/Application Support/CrashReporter',
            title: '支持文件',
            style: 'success',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library/Preferences',
            title: '支持文件',
            style: 'success',
            key: 'CFBundleIdentifier',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library/Cookies',
            title: 'Cookie',
            style: 'success',
            key: 'CFBundleIdentifier',
            reg: ['^__key__.*?', 'i'],
        },
        {
            path: '~/Library/Caches',
            title: '缓存',
            style: 'success',
            key: 'CFBundleIdentifier',
            reg: ['^__key__.*?', 'i'],
        },

        {
            path: '~/Library/Containers',
            title: '容器',
            style: 'success',
            key: 'CFBundleIdentifier',
            reg: ['^__key__.*?', 'i'],
        },

    ]
}