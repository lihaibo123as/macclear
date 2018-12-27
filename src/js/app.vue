<style lang="scss">
.app-item {
  .panel-heading {
    padding: 5px 10px;
  }
  .media-body,
  .media-left,
  .media-right {
    vertical-align: middle;
  }
  .media-object {
    width: 32px;
    height: 32px;
    text-align: center;
    > .fa {
      line-height: 32px;
      font-size: 24px;
    }
  }
  .app-action {
    margin-left: 10px;
    cursor: pointer;
    text-align: center;
  }
  .app-time {
    > span {
      padding: 0 5px 0 0;
      color: #808080;
      font-size: 12px;
    }
  }
  .app-sign {
    padding: 0 5px 0 0;
    font-size: 12px;
  }
  .app-sub-icon {
    display: none;
  }
  .app-subapp {
    margin-top: 5px;
    font-size: 12px;
    .app-sub-icon {
      display: inline-block;
      color: #e00c0c;
    }
    &.panel-group {
      margin-bottom: 0px;
      > section {
        margin-bottom: 5px;
      }
    }
    .app-time {
      display: none;
    }
  }
}
</style>
<template>
  <div class="panel panel-default app-item">
    <div class="panel-heading">
      <div class="pull-right">
        <small class="text-success" v-if="app.info.plist">v{{app.info.plist.CFBundleShortVersionString}}</small>
        <a class="app-action label label-danger" v-if="!app.del&&app.info.rules" v-on:click="appremove(app)">
          <i class="fa fa-trash"></i> 删除
        </a>
        <span v-if="app.del" class="label label-success">已删除</span>
      </div>
      <span class="app-sub-icon">
        <i class="fa fa-microchip"></i> 子应用 :
      </span>
      <strcolor v-bind:search="status.search" v-bind:text="app.name"></strcolor>
      <small v-if="app.info.size" class="text-success margin-left-5" style="margin-right:5px;">{{app.info.size?app.info.size:'正在计算...'}}</small>
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
            <i v-if="app.info.loading" class="fa fa-spinner fa-pulse"></i>
            {{app.info.rules?'更新文件':'分析文件'}}
          </button>
        </div>
        <div class="media-left">
          <img v-if="app.info.icon" :src="app.info.icon" class="media-object">
          <div v-if="!app.info.icon" class="media-object">
            <i class="fa fa-cube"></i>
          </div>
        </div>
        <div class="media-body">
          <div class="app-path">路径:
            <strcolor class="text-info" v-bind:search="status.search" v-bind:text="app.filepath"></strcolor>
          </div>
          <div class="app-sign" v-if="app.info.plist">
            应用名:
            <span class="text-info">{{app.info.plist.CFBundleName}}</span>
            标识:
            <span class="text-info">{{app.info.plist.CFBundleIdentifier}}</span>
          </div>
          <div class="app-time">
            <span>访问时间:
              <timestr v-bind:time="app.atimeMs"></timestr>
            </span>
            <span>修改时间:
              <timestr v-bind:time="app.mtimeMs"></timestr>
            </span>
            <span>创建时间:
              <timestr v-bind:time="app.birthtimeMs"></timestr>
            </span>
          </div>
        </div>
        <!-- 延迟显示定位点 -->
        <lazy-component v-if="app.name" @show="lazyshow(app)"></lazy-component>
      </div>
      <div class="panel-group app-subapp" v-if="app.subapps.length">
        <section v-for="(subapp) in app.subapps" :key="subapp.uuid">
          <app-item v-bind:status="status" v-bind:app="subapp"></app-item>
        </section>
      </div>
      <app-rules v-if="app.info.rules&&app.info.rules.length" v-bind:rules="app.info.rules"></app-rules>
    </div>
  </div>
</template>

<script>
const os = require("../util/os"),
  conf = require("../config"),
  ruleconfig = require("../rules"),
  tool = require("../util/tool"),
  store = require("store");
module.exports = Vue.extend({
  data: () => {
    return {
      files: []
    };
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
    reset: function() {},
    lazyshow: function(app) {
      var that = this;
      that.appinfo(app);
    },
    appinfo: function(app) {
      this.$set(app, "loading", true);
      if (app.subapps.length) {
        for (var i in app.subapps) {
          this.appinfo(app.subapps[i]);
        }
      }
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
      if (app.subapps.length) {
        for (var i in app.subapps) {
          this.apprules(app.subapps[i]);
        }
      }
      if (app.info.plist) {
        this.$set(app.info, "loading", true);
        this.$set(app.info, "rules", []);
        tool
          .queue("apprules", tool.appRules, [app, ruleconfig.rules], tool, {
            timeout: 60000
          })
          .then(
            newapp => {
              app.info.loading = false;
              console.warn("App 文件分析完成:", newapp.name, newapp);
            },
            err => {
              app.info.loading = false;
              console.error(`App文件分析异常:${app.name}`, err, app);
            }
          );
      } else {
        tool.msg("app基础信息异常:", "warning");
      }
    },
    appremove: function(app) {
      tool
        .confirm({
          title: "删除应用?",
          desc: `请输入应用名: <b class="text-danger">${
            app.name
          }</b> ,点击确定删除`,
          type: "warning",
          input: true
        })
        .then(
          item => {
            console.log("确定", item);
            if (!item.value) {
              tool.msg("请输入应用名称", "info");
              return;
            }
            if (item.value && item.value.trim() == app.name) {
              console.log("删除", app);
              this._appremove(app);
            }
          },
          err => {
            console.log("取消", err);
          }
        );
    },
    _appremove: function(app) {
      console.log("删除 app", app);
      let delcount = 0,
        apps = [],
        rules = [],
        notify = () => {
          console.log("notify", app);
          this._appremove(app);
        };
      apps.push(app);
      if (app.subapps.length) {
        for (var i in app.subapps) {
          apps.push(app.subapps[i]);
        }
      }
      console.log("关闭应用:", apps);
      tool.quitApps(apps);

      for (var i in apps) {
        if (apps[i].info.rules) {
          rules = rules.concat(apps[i].info.rules);
        }
      }

      console.log("处理规则列表", rules);
      if (rules.length) {
        for (var i in rules) {
          let rule = rules[i];
          if (rule.files && rule.files.length) {
            for (var j in rule.files) {
              if (rule.files[j].err) {
                delcount++;
                continue;
              }
              if (rule.files[j].del) {
                continue;
              } else if (rule.files[j].deling) {
                delcount++;
              } else {
                delcount++;
                tool.removeFile(rule.files[j], notify);
              }
            }
          }
        }
        if (delcount == 0) {
          console.log("清理完成:", app);
          tool.msg("删除应用完成", "success");
          this.$set(app, "del", true);
        }
      }
    }
  },
  watch: {},
  mounted: function() {
    // console.group("mounted 挂载结束状态===============》");
    // console.log("app-rules-config", this);
  },
  template: `__template__` //必须是单引号 模板替换标识可在配置内更改
});
</script>
