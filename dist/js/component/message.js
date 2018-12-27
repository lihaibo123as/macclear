/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 21, 2018
 */
module.exports = {
  methods: {
    show: function() {
      this.$emit("update:loading", true); //触发父类属性更新
    },
    hide: function() {
      this.$emit("update:loading", false);
    }
  },
  props: {
    loading: Boolean
  },
  created: function() {
    console.log("loading create", this.$data);
  },
  updated: () => {
    console.log("loading updated", this.$data);
  },
  template: `<div class="loading" v-on:click="hide" v-if="loading"><div class="loading-bg"></div><div class="loading-icon"><i class="layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i></div></div>`
};