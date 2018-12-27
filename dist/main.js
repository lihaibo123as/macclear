/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件.
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 27, 2018
 */
module.exports = {
  start: function (selecter) {
    const os = require("./util/os"),
      conf = require("./config"),
      tool = require("./util/tool"),
      store = require('store');
    //调试模式
    if (conf.debug) {
      os.debug();
      console.log("os:", os, tool);
      console.log("nw", nw);
      console.log("conf", conf);
      console.log("process", process);
      console.log("window", nw.Window.get().window);

      //本地存储
      if (!store.get('visit')) {
        store.set('visit', { count: 1 });
      } else {
        var visit = store.get('visit');
        visit.count++;
        store.set('visit', visit);
      }
      console.log('visit', store.get('visit'));
    }

    //全局组件
    Vue.component("loading", require("./js/component/loading"));
    Vue.component("msgdriver", require("./js/component/msgdriver"));
    Vue.component("strcolor", require("./js/component/strcolor"));
    Vue.component("timestr", require("./js/component/timestr"));
    Vue.component("errmsg", require("./js/component/errmsg"));
    Vue.component("app-item", require("./js/app"));
    //第三方插件
    Vue.use(require("../node_modules/vue-lazyload/vue-lazyload.js"), {
      lazyComponent: true
    });
    this.app = new Vue({
      el: selecter,
      data: {
        //静态属性
        status: {
          page: 'page-apps',
          visit: store.get('visit'),
          loading: false,
          title: "Mac清理工具"
        },
      },
      computed: {
      },
      components: {
        //组件
        'page-apps': require('./js/apps'),
        'page-config': require('./js/config')
      },
      methods: {
        page: function (page) {
          console.log('index', this);
          this.status.page = 'page-' + page;
        },
        init: function () {
          var that = this;
          console.log("xinit", this);
        },
      },
      // beforeCreate: function () {
      //     console.group('beforeCreate 创建前状态===============》', this);
      //     console.log("%c%s", "color:red", "el     : ", this.$el); //undefined
      //     console.log("%c%s", "color:red", "data   : ", this.$data); //undefined
      // },
      // created: function () {
      //   console.group('created 创建完毕状态===============》');
      //   console.log("%c%s", "color:red", "el     : ", this.$el); //undefined
      //   console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
      // },
      // beforeMount: function () {
      //     console.group('beforeMount 挂载前状态===============》');
      //     console.log("%c%s", "color:red", "el     : ", this.$el); //已被初始化
      //     console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
      // },
      mounted: function () {
        console.group('mounted 挂载结束状态===============》');
        console.log("%c%s", "color:red", "el     : ", this); //已被初始化
        // console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
        this.init();
      }
      // beforeUpdate: function () {
      //     console.group('beforeUpdate 更新前状态===============》');
      //     console.log("%c%s", "color:red", "el     : ", this.$el);
      //     console.log("%c%s", "color:red", "data   : ", this.$data);
      // },
      // updated: function () {
      //     console.group('updated 更新完成状态===============》');
      //     console.log("%c%s", "color:red", "el     : ", this.$el);
      //     console.log("%c%s", "color:red", "data   : ", this.$data);
      // },
      // beforeDestroy: function () {
      //     console.group('beforeDestroy 销毁前状态===============》');
      //     console.log("%c%s", "color:red", "el     : ", this.$el);
      //     console.log("%c%s", "color:red", "data   : ", this.$data);
      // },
      // destroyed: function () {
      //     console.group('destroyed 销毁完成状态===============》');
      //     console.log("%c%s", "color:red", "el     : ", this.$el);
      //     console.log("%c%s", "color:red", "data   : ", this.$data);
      // }
    });
  }
};