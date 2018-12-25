<style lang="scss">
.app-apps {
  position: relative;
  .media-object {
    width: 64px;
    height: 64px;
    text-align: center;
    > .fa {
      line-height: 64px;
      font-size: 56px;
    }
  }
}
</style>

<template>
  <section class="app-apps">
    <loading v-bind:loading.sync="status.loading"></loading>
    <div class="row">
      <!-- <div class="col-xs-12"><p>{{status}}</p></div> -->
      <div class="col-xs-12 margin-10">
        <div class="input-group">
          <div class="input-group-addon">{{dir}}/</div>
          <input type="text" class="form-control" v-model="status.search" placeholder="检索">
          <div class="input-group-btn">
            <button id="genpassword" class="btn btn-success" type="button">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-xs-12 margin-10">
        <div class="pull-right">
          <button class="btn-default btn btn-xs margin-right-5" @click="toggleSort(status.orderBy)">
            <i class="fa" v-bind:class="orderIcon"></i>
          </button>
          <div class="btn-group btn-group-xs">
            <button
              class="btn-default btn"
              v-bind:class="{active:status.order=='name'}"
              v-on:click="status.order='name'"
            >默认</button>
            <button
              class="btn-default btn"
              v-bind:class="{active:status.order=='atimeMs'}"
              v-on:click="status.order='atimeMs'"
            >访问时间</button>
            <button
              class="btn-default btn"
              v-bind:class="{active:status.order=='mtimeMs'}"
              v-on:click="status.order='mtimeMs'"
            >修改时间</button>
            <button
              class="btn-default btn"
              v-bind:class="{active:status.order=='birthtimeMs'}"
              v-on:click="status.order='birthtimeMs'"
            >创建时间</button>
          </div>
        </div>
        <span class="text-muted">总计:</span>
        <span>{{status.count}}</span>
        <span class="clearfix"></span>
      </div>
    </div>
    <div class="panel panel-default" v-if="status.count==0">
      <div class="panel-body center-block" style="text-align: center;">未找到 app</div>
    </div>
    <div
      class="panel panel-default"
      v-for="(app, index) in sort(search(apps,status.search),status.order,status.orderBy)"
      :key="index"
    >
      <div class="panel-heading">
        <strcolor v-bind:search="status.search" v-bind:text="app.name"></strcolor>
        <small v-if="app.info.plist">版本:{{app.info.plist.CFBundleShortVersionString}}</small>
        <small v-if="app.info.plist">包:{{app.info.plist.CFBundleIdentifier}}</small>
        <small v-if="app.info.plist">应用:{{app.info.plist.CFBundleName}}</small>
      </div>
      <div class="panel-body">
        <div class="media">
          <div class="media-action pull-right">
            <button
              v-if="!app.info.size"
              type="button"
              class="btn btn-success btn-xs"
              v-on:click="appinfo(app)"
              v-bind:disabled="app.loading"
            >
              <i v-if="app.loading" class="fa fa-spinner fa-pulse"></i> 应用信息
            </button>
            <button
              v-if="app.info.size"
              type="button"
              class="btn btn-info btn-xs"
              v-on:click="apprules(app)"
              v-bind:disabled="app.info.loading"
            >
              <i v-if="app.info.loading" class="fa fa-spinner fa-pulse"></i> 分析文件
            </button>
          </div>
          <div class="media-left">
            <img v-if="app.info.icon" :src="app.info.icon" class="media-object">
            <div v-if="!app.info.icon" class="media-object">
              <i class="fa fa-cube"></i>
            </div>
          </div>
          <div class="media-body">
            <div>位置:
              <strcolor v-bind:search="status.search" v-bind:text="app.filepath"></strcolor>
            </div>
            <div>大小:{{app.info.size?app.info.size:'正在计算...'}}</div>
            <div>访问时间:
              <timestr v-bind:time="app.atimeMs"></timestr>
            </div>
            <div>修改时间:
              <timestr v-bind:time="app.mtimeMs"></timestr>
            </div>
            <div>创建时间:
              <timestr v-bind:time="app.birthtimeMs"></timestr>
            </div>
          </div>
          <!-- 延迟显示定位点 -->
          <lazy-component v-if="app.name" @show="lazyshow(app)"></lazy-component>
        </div>
        <app-rules v-if="app.info.rules" v-bind:rules="app.info.rules"></app-rules>
      </div>
    </div>
  </section>
</template>

<script>
const os = require("../util/os"),
  conf = require("../config"),
  ruleconfig = require("../rules"),
  tool = require("../util/tool"),
  store = require("store");
module.exports = {
  data: () => {
    return {
      //静态属性
      apps: [],
      dir: ruleconfig.apppath ? ruleconfig.apppath : "/",
      status: {
        visit: store.get("visit"),
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
    };
  },
  computed: {
    //计算属性
    orderIcon: function() {
      return {
        "fa-sort-amount-desc": this.status.orderBy == "desc",
        "fa-sort-amount-asc": this.status.orderBy == "asc"
      };
    }
  },
  components: {
    //组件
    "app-rules": require("./rules")
  },
  methods: {
    msg: function() {
      tool.msg("怎么了");
    },
    lazyshow: function(app) {
      var that = this;
      that.appinfo(app);
    },
    appinfo: function(app) {
      this.$set(app, "loading", true);
      tool.queue("appinfo", tool.appInfo, [app], tool).then(
        newapp => {
          newapp.loading = false;
          console.log("App 详情:", newapp.name, newapp, newapp.info);
        },
        err => {
          tool.msg(`App:${app.name},详情异常:${err}`, "warning");
          console.warn(`App详情异常:${app.name}`, err, app);
        }
      );
    },
    apprules: function(app) {
      if (app.info.plist) {
        this.$set(app.info, "loading", true);
        tool
          .queue("apprules", tool.appRules, [app, ruleconfig.rules], tool)
          .then(
            newapp => {
              newapp.info.loading = false;
              console.log("App 文件分析完成:", newapp.name, newapp);
            },
            err => {
              console.error(`App文件分析异常:${app.name}`, err, app);
            }
          );
      } else {
        tool.msg("app基础信息异常:", "warning");
      }
    },
    toggleSort: function(sort) {
      this.status.orderBy = sort == "desc" ? "asc" : "desc";
      console.log("sort", sort, this.status.orderBy);
    },
    sort: function(arrays, key, type) {
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
    search: function(apps, search) {
      return apps.filter(function(app) {
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
    loading: function() {
      this.status.loading = true;
      console.log("loading", this.status.loading);
    },
    init: function() {
      var that = this;
      console.log("apps init:", ruleconfig);
      that.status.loading = true;
      tool.searchApp(that.dir).then(
        function(apps) {
          apps.forEach(app => {
            that.apps.push(Object.assign({}, that.objtpl.app, app));
          });
          console.log("app", that.apps);
          tool.msg(`搜索 App完成`, "success");
          that.status.loading = false;
        },
        function(err) {
          console.log("查询错误", err.message);
          tool.msg(`搜索 APP错误:${err.message}`, "danger");
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
  mounted: function() {
    console.group("mounted 挂载结束状态===============》");
    console.log("%c%s", "color:red", "el     : ", this); //已被初始化
    // console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
    this.init();
  },
  template: `__template__` //必须是单引号 模板替换标识可在配置内更改
};
</script>
