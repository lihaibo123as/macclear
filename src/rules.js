/**
 * 检索 app 规则配置
 */
module.exports = {
    apppath: '/Applications',
    rules: [
        //系统资源库
        {
            path: '/Library',
            title: '资源库',
            level: 'info',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'g'],//正则数据
        },

        //用户资源库
        {
            path: '~/Library',
            title: '资源库',
            level: 'info',
            key: 'CFBundleName',
            reg: ['^__key__.*?', 'g'],
        },
    ]
}