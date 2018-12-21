module.exports = {
  start: function (selecter) {
    const os = require("./util/os"),
      conf = require("./config"),
      tool = require("./util/tool");
    console.log("os:", os);
    if (conf.debug) {
      os.debug();
      console.log("nw", nw);
      console.log("conf", conf);
      console.log("process", process);
      console.log("window", nw.Window.get().window);
    }

    //全局组件
    Vue.component("loading", require("./js/component/loading"));
    Vue.component("msgdriver", require("./js/component/msgdriver"));
    Vue.component("strcolor", require("./js/component/strcolor"));
    Vue.component("timestr", require("./js/component/timestr"));
    //第三方插件
    Vue.use(require("../node_modules/vue-lazyload/vue-lazyload.js"), {
      lazyComponent: true
    });
    this.app = new Vue({
      el: selecter,
      data: {
        //静态属性
        conf: conf,
        apps: [],
        dir: conf.search_path ? conf.search_path : "/",
        status: {
          search: "",
          order: "name",
          orderBy: "asc",
          count: 0,
          loading: true,
          title: "Mac优化工具 Example page header"
        },
        objtpl: {
          app: {
            //app 对象基础属性
            info: {
              // size: '计算中...',
              // icon: '',
              // plist: '',
            }
          }
        }
      },
      computed: {
        //计算属性
        orderIcon: function () {
          return {
            "fa-sort-amount-desc": this.status.orderBy == "desc",
            "fa-sort-amount-asc": this.status.orderBy == "asc"
          };
        }
      },
      components: {
        //组件
        // 'xlog': xbutton
      },
      methods: {
        msg: function () {
          tool.msg('怎么了');
        },

        lazyshow: function (app) {
          // console.log('appshow', app);
          // this.appinfo(app);
          var that = this;
          setTimeout(function () {
            that.appinfo(app);
          }, 100);
        },
        appinfo: function (app) {
          // console.log('获取 app 详情', app.name, app);
          tool.appInfo(app).then(
            newapp => {
              console.log("App 详情:", newapp.name, newapp);
            },
            err => {
              console.error(`App详情异常:${app.name}`, err, app);
            }
          );
        },
        toggleSort: function (sort) {
          this.status.orderBy = sort == "desc" ? "asc" : "desc";
          console.log("sort", sort, this.status.orderBy);
        },
        sort: function (arrays, key, type) {
          this.status.count = arrays.length;
          if (arrays.length && key && type) {
            var temp;
            switch (type) {
              case "desc":
                temp = arrays.sort((a, b) => a[key] - b[key]).reverse();
                break;
              default:
                temp = arrays.sort((a, b) => a[key] - b[key]);
                break;
            }
            return temp;
          }
          return arrays;
        },
        search: function (apps, search) {
          return apps.filter(function (app) {
            if (search) {
              //检索过滤
              search = search.toLowerCase();
              if (app.name.toLowerCase().indexOf(search) > -1) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          });
        },
        loading: function () {
          this.status.loading = true;
          console.log("loading", this.status.loading);
        },
        searchdir: function (dir) {
          this.status.otherdirs = tool.searchDirs(dir);
        },
        init: function () {
          var that = this;
          that.status.loading = true;

          tool.searchApp(that.dir).then(
            function (apps) {
              apps.forEach(app => {
                that.apps.push(Object.assign({}, that.objtpl.app, app));
              });
              console.log("app", that.apps);
              that.status.loading = false;
            },
            function (err) {
              console.log("查询错误", err.message);
            }
          );
          console.log("xinit", this);
        }
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