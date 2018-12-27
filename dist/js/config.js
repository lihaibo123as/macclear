/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件.
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 27, 2018
 */
module.exports = Vue.extend({
  data: () => {
    return {
      title: "规则管理"
    };
  },
  props: {
    rules: Array
  },
  computed: {},
  methods: {},
  watch: {},
  mounted: function() {
    console.group("mounted 挂载结束状态===============》");
    console.log("%c%s", "color:red", "el     : " , this.$el); //已被初始化
    console.log("%c%s", "color:red", "data   : " , this.$data); //已被初始化
    console.log("app-rules-config", this);
  },
  template: `<div class="rules">app检索规则配置</div>` //必须是单引号 模板替换标识可在配置内更改
});