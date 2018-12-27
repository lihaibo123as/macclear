/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件.
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 27, 2018
 */
    nw.loadCss({content : ".app-rule .toggle-icon{float:right;height:20px;text-align:center;font-size:12px;line-height:20px;display:block;color:#666;cursor:pointer}.app-rule hr{margin:10px 0}.app-rule .panel{font-size:12px}.app-rule .panel.nofile{opacity:0.5;display:none}.app-rule .panel.iserror{opacity:1;display:block}.app-rule .panel .panel-heading{cursor:pointer;padding:5px 10px}.app-rule .panel .panel-heading .panel-title{font-size:14px}.app-rule .panel .panel-heading .header-icon{padding:0 0 0 8px}.app-rule .panel .list-group-item{padding:5px 10px}.app-rule .panel .badge{padding:1px 5px}.app-rule .panel .file-item{width:70%}.app-rule .panel .file-action{width:30%;display:flex;flex-direction:row-reverse}.app-rule .panel .file-action .action-item{text-align:center;cursor:pointer}"});

const tool = require("../util/tool");
module.exports = Vue.extend({
  data: () => {
    return {
      // rules: []
      status: {
        show: false
      }
    };
  },
  props: {
    rules: Array
  },
  computed: {},
  methods: {
    remove: function(file) {
      tool
        .confirm({
          title: "警告!",
          desc: `确定删除? 文件:${file.path}`,
          type: "warning"
        })
        .then(
          function(item) {
            tool.removeFile(file);
          },
          function(err) {}
        );
    },
    toggleAll: function() {
      this.status.show = !this.status.show;
      for (var i in this.rules) {
        this.rules[i].hide;
        this.$set(this.rules[i], "show", this.status.show);
      }
    },
    toggleRule: function(rule) {
      this.$set(rule, "show", !rule.show);
    },
    ruleClass: function(rule) {
      return [
        rule.files.length ? "" : "nofile",
        rule.err ? "iserror" : "",
        "panel-" + rule.style
      ];
    },
    ruleToggleIcon: function(rule) {
      return [rule.show ? "fa-caret-down" : "fa-caret-left"];
    },
    fileType: function(file) {
      return {
        "fa-folder": file.isDir,
        "fa-file": file.isFile
      };
    },
    fileColor: function(style) {
      return ["text-" + style];
    }
  },
  watch: {},
  mounted: function() {
    // console.group("mounted 挂载结束状态===============》");
    // console.log("%c%s", "color:red", "el     : ", this.$el); //已被初始化
    // console.log("%c%s", "color:red", "data   : ", this); //已被初始化
  },
  template: `<div class="app-rule"><hr><h5><span v-on:click="toggleAll" class="toggle-icon">{{status.show?'收起':'展开'}}</span>应用关联文件数据</h5><div class="row"><div class="col-xs-12"><div class="panel-group"><div class="panel" v-bind:class="ruleClass(rule)" v-for="(rule, index) in rules" :key="index"><div class="panel-heading" v-on:click="toggleRule(rule)"><div class="pull-right"><i v-if="rule.loading" class="fa fa-spinner fa-pulse"></i><span v-if="!rule.files.length&amp;&amp;!rule.loading">未匹配到数据:{{rule.regstr}}</span><span v-if="rule.files.length">文件数:{{rule.files.length}}</span><span v-if="rule.files.length" class="header-icon"><i class="fa" v-bind:class="ruleToggleIcon(rule)"></i></span></div><h3 class="panel-title"><span class="file-path">{{rule.path}}</span><span v-if="rule.title">({{rule.title}})</span><div class="text-danger" v-if="rule.err"><errmsg v-bind:error="rule.err"></errmsg></div></h3></div><!-- <div class="panel-body"></div> --><ul class="list-group" v-if="rule.show"><li class="list-group-item" v-for="(file, index) in rule.files" :key="index"><div class="file-action pull-right"><span v-if="file.deling" class="action-status label label-warning"><i class="fa fa-spinner fa-pulse"></i> 删除中...</span><span v-if="file.del" class="action-status label label-success">已删除</span><span class="action-item label label-danger" v-if="!file.del&amp;&amp;!file.deling" v-on:click="remove(file)"><i class="fa fa-trash"></i> 删除</span></div><div class="file-item"><span class="pull-right">{{file.size}}</span><span v-bind:class="fileColor(rule.style)"><i class="fa" v-bind:class="fileType(file)"></i></span>{{file.path}}<span class="text-danger" v-if="file.isApp"><i class="fa fa-apple"></i></span></div></li></ul></div></div></div></div></div>` //必须是单引号 模板替换标识可在配置内更改
});