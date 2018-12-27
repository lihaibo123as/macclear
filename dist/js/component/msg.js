/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 21, 2018
 */
    nw.loadCss({content : ".message{position:absolute;top:0;left:0;z-index:2001;width:400px;height:200px;background:#333333}"});

module.exports = Vue.extend({
  data: () => {
    return {
      title: "按钮",
      count: 0
    };
  },
  props: {},
  computed: {
    teststr: function() {}
  },
  methods: {
    titlewatch: function() {
      console.log("监听处理 title变化数据");
    },
    click: function() {
      console.log(this);
      this.count++;
    }
  },
  watch: {
    test() {},
    title: "titlewatch"
  },
  template: `<div class="message"><p class="bg-primary">Nullam id dolor id nibh ultricies vehicula ut id elit.<button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button></p></div>`, //必须是单引号 模板替换标识可在配置内更改
  beforeCreate: function() {
    console.group("beforeCreate 创建前状态===============》", this);
    console.log("%c%s", "color:red", "el     : ", this.$el); //undefined
    console.log("%c%s", "color:red", "data   : ", this.$data); //undefined
    console.log("%c%s", "color:red", "message: ", this.message);
  },
  created: function() {
    console.group("created 创建完毕状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el); //undefined
    console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
    console.log("%c%s", "color:red", "this   : ", this); //已被初始化
  },
  beforeMount: function() {
    console.group("beforeMount 挂载前状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el); //已被初始化
    console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
  },
  mounted: function() {
    console.group("mounted 挂载结束状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el); //已被初始化
    console.log("%c%s", "color:red", "data   : ", this.$data); //已被初始化
    this.$emit("msgdriver", this);
    console.log("上报事件:msgdriver", this);
  },
  beforeUpdate: function() {
    console.group("beforeUpdate 更新前状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el);
    console.log("%c%s", "color:red", "data   : ", this.$data);
  },
  updated: function() {
    console.group("updated 更新完成状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el);
    console.log("%c%s", "color:red", "data   : ", this.$data);
  },
  beforeDestroy: function() {
    console.group("beforeDestroy 销毁前状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el);
    console.log("%c%s", "color:red", "data   : ", this.$data);
  },
  destroyed: function() {
    console.group("destroyed 销毁完成状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el);
    console.log("%c%s", "color:red", "data   : ", this.$data);
  }
});