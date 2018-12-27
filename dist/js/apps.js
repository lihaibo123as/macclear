/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件.
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 27, 2018
 */
    nw.loadCss({content : ".app-apps{position:relative}.app-apps .panel-group>section{margin-bottom:10px}"});

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
  },
  methods: {
    test: function() {
      tool.msg("怎么了");
      tool
        .confirm({
          title: "警告!",
          desc: "删除文件:",
          type: "danger"
        })
        .then(
          function(item) {
            console.log("确定", item);
          },
          function(err) {
            console.log("取消", err);
          }
        );
    },
    msg: function() {
      tool.msg("怎么了");
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
    reset: function() {
      this.apps = [];
      this.init();
    },
    init: function() {
      var that = this;
      console.log("apps init:", ruleconfig);
      that.status.loading = true;
      tool.searchApp(that.dir, true).then(
        function(apps) {
          apps.forEach(app => {
            that.apps.push(Object.assign({}, app));
          });
          console.log("App 列表", that.apps);
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
  template: `<section class="app-apps"><loading v-bind:loading.sync="status.loading"></loading><div class="row"><!-- <div class="col-xs-12"><p>{{status}}</p></div> --><div class="col-xs-12 margin-10"><div class="input-group"><div class="input-group-addon">{{dir}}/</div><input type="text" class="form-control" v-model="status.search" placeholder="检索"><div class="input-group-btn"><button id="genpassword" class="btn btn-success" type="button" v-on:click="reset"><i class="fa fa-refresh"></i></button></div></div></div><div class="col-xs-12 margin-10"><div class="pull-right"><button class="btn-default btn btn-xs margin-right-5" @click="toggleSort(status.orderBy)"><i class="fa" v-bind:class="orderIcon"></i></button><div class="btn-group btn-group-xs"><button class="btn-default btn" v-bind:class="{active:status.order=='name'}" v-on:click="status.order='name'">默认</button><button class="btn-default btn" v-bind:class="{active:status.order=='atimeMs'}" v-on:click="status.order='atimeMs'">访问时间</button><button class="btn-default btn" v-bind:class="{active:status.order=='mtimeMs'}" v-on:click="status.order='mtimeMs'">修改时间</button><button class="btn-default btn" v-bind:class="{active:status.order=='birthtimeMs'}" v-on:click="status.order='birthtimeMs'">创建时间</button></div></div><span class="text-muted">总计:</span><span>{{status.count}}</span><!-- <button class="btn btn-default" v-on:click="test">测试</button> --><span class="clearfix"></span></div></div><div class="panel panel-default" v-if="status.count==0"><div class="panel-body center-block" style="text-align: center;">未找到 app</div></div><div class="panel-group" v-if="apps.length>0"><section v-for="(app) in sort(search(apps,status.search),status.order,status.orderBy)" :key="app.uuid"><app-item v-bind:status="status" v-bind:app="app"></app-item></section></div></section>` //必须是单引号 模板替换标识可在配置内更改
};