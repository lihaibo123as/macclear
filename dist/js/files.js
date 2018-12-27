/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 24, 2018
 */
module.exports = Vue.extend({
  data: () => {
    return {
      files: []
    };
  },
  props: {},
  computed: {},
  methods: {},
  watch: {},
  mounted: function() {
    console.group("mounted 挂载结束状态===============》");
    console.log("%c%s", "color:red", "el     : " + this.$el); //已被初始化
    console.log("%c%s", "color:red", "data   : " + this.$data); //已被初始化
  },
  beforeUpdate: function() {
    console.group("beforeUpdate 更新前状态===============》");
    console.log("%c%s", "color:red", "el     : " + this.$el);
    console.log("%c%s", "color:red", "data   : " + this.$data);
  },
  updated: function() {
    console.group("updated 更新完成状态===============》");
    console.log("%c%s", "color:red", "el     : " + this.$el);
    console.log("%c%s", "color:red", "data   : " + this.$data);
  },
  beforeDestroy: function() {
    console.group("beforeDestroy 销毁前状态===============》");
    console.log("%c%s", "color:red", "el     : " + this.$el);
    console.log("%c%s", "color:red", "data   : " + this.$data);
  },
  destroyed: function() {
    console.group("destroyed 销毁完成状态===============》");
    console.log("%c%s", "color:red", "el     : " + this.$el);
    console.log("%c%s", "color:red", "data   : " + this.$data);
  },
  template: `<div class="rules">app 文件列表</div>` //必须是单引号 模板替换标识可在配置内更改
});