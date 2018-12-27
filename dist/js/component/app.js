/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 25, 2018
 */
    nw.loadCss({content : ".app-item .panel-heading{padding:5px 10px}.app-item .media-body,.app-item .media-left,.app-item .media-right{vertical-align:middle}.app-item .media-object{width:32px;height:32px;text-align:center}.app-item .media-object>.fa{line-height:32px;font-size:24px}.app-item .app-action{font-size:14px;color:red;cursor:pointer;display:inline-block;width:20px;text-align:center}.app-item .app-action:first-child{margin-left:10px}.app-item .app-time>span{padding:0 5px 0 0;color:#808080;font-size:12px}.app-item .app-sign{padding:0 5px 0 0;font-size:12px}.app-item .app-sub-icon{display:none}.app-item .app-subapp{margin-top:5px;font-size:12px}.app-item .app-subapp .app-sub-icon{display:inline-block;color:#e00c0c}.app-item .app-subapp.panel-group{margin-bottom:0px}.app-item .app-subapp.panel-group>section{margin-bottom:5px}.app-item .app-subapp .app-time{display:none}"});

const os = require("../util/os"),
  conf = require("../config"),
  ruleconfig = require("../rules"),
  tool = require("../util/tool"),
  store = require("store");
module.exports = Vue.extend({
  data: () => {
    return {};
  },
  props: {
    app: Object,
    status: Object
  },
  computed: {},
  components: {
    "app-rules": require("./rules")
  },
  methods: {
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
    appremove: function(app) {}
  },
  watch: {},
  mounted: function() {
    // console.group("mounted 挂载结束状态===============》");
    // console.log("app-rules-config", this);
  },
  template: `<div class="panel panel-default app-item"><div class="panel-heading"><div class="pull-right"><small class="text-success" v-if="app.info.plist">v{{app.info.plist.CFBundleShortVersionString}}</small><a class="app-action" v-if="app.info.rules"><i class="fa fa-trash"></i></a></div><span class="app-sub-icon"><i class="fa fa-microchip"></i> 子应用 :</span><strcolor v-bind:search="status.search" v-bind:text="app.name"></strcolor><small v-if="app.info.size" class="text-success margin-left-5" style="margin-right:5px;">{{app.info.size?app.info.size:'正在计算...'}}</small></div><div class="panel-body"><div class="media"><div class="media-action pull-right"><button v-if="!app.info.size" type="button" class="btn btn-success btn-xs" v-on:click="appinfo(app)" v-bind:disabled="app.loading"><i v-if="app.loading" class="fa fa-spinner fa-pulse"></i> 应用信息</button><button v-if="app.info.size" type="button" class="btn btn-info btn-xs" v-on:click="apprules(app)" v-bind:disabled="app.info.loading"><i v-if="app.info.loading" class="fa fa-spinner fa-pulse"></i> 分析文件</button></div><div class="media-left"><img v-if="app.info.icon" :src="app.info.icon" class="media-object"><div v-if="!app.info.icon" class="media-object"><i class="fa fa-cube"></i></div></div><div class="media-body"><div class="app-path">路径:<strcolor class="text-info" v-bind:search="status.search" v-bind:text="app.filepath"></strcolor></div><div class="app-sign" v-if="app.info.plist">应用名:<span class="text-info">{{app.info.plist.CFBundleName}}</span>包名:<span class="text-info">{{app.info.plist.CFBundleIdentifier}}</span></div><div class="app-time"><span>访问时间:<timestr v-bind:time="app.atimeMs"></timestr></span><span>修改时间:<timestr v-bind:time="app.mtimeMs"></timestr></span><span>创建时间:<timestr v-bind:time="app.birthtimeMs"></timestr></span></div></div><!-- 延迟显示定位点 --><lazy-component v-if="app.name" @show="lazyshow(app)"></lazy-component></div><div class="panel-group app-subapp" v-if="app.subapps.length"><section v-for="(subapp) in app.subapps" :key="subapp.uuid"><app-item v-bind:status="status" v-bind:app="subapp"></app-item></section></div><app-rules v-if="app.info.rules" v-bind:rules="app.info.rules"></app-rules></div></div>` //必须是单引号 模板替换标识可在配置内更改
});